import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const getByOnboarding = query({
  args: { onboardingId: v.id("onboarding") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("techSpecs")
      .withIndex("by_onboarding", (q) => q.eq("onboardingId", args.onboardingId))
      .first();
  },
});

export const create = mutation({
  args: { onboardingId: v.id("onboarding") },
  handler: async (ctx, args) => {
    // Check if one already exists
    const existing = await ctx.db
      .query("techSpecs")
      .withIndex("by_onboarding", (q) => q.eq("onboardingId", args.onboardingId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { status: "generating", error: undefined });
      return existing._id;
    }
    return await ctx.db.insert("techSpecs", {
      onboardingId: args.onboardingId,
      status: "pending",
    });
  },
});

export const updateSpec = mutation({
  args: {
    id: v.id("techSpecs"),
    status: v.union(
      v.literal("pending"),
      v.literal("generating"),
      v.literal("completed"),
      v.literal("error")
    ),
    vision: v.optional(v.string()),
    requirements: v.optional(v.string()),
    architecture: v.optional(v.string()),
    frameworks: v.optional(v.string()),
    tests: v.optional(v.string()),
    backlog: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const generate = action({
  args: { onboardingId: v.id("onboarding") },
  handler: async (ctx, args) => {
    // 1. Get the onboarding payload
    const onboarding = await ctx.runQuery(api.onboarding.get, { id: args.onboardingId });
    if (!onboarding) throw new Error("Onboarding not found");

    // 2. Create or reset the techSpecs record
    const specId = await ctx.runMutation(api.techSpecs.create, {
      onboardingId: args.onboardingId,
    });

    // 3. Mark as generating
    await ctx.runMutation(api.techSpecs.updateSpec, {
      id: specId,
      status: "generating",
    });

    try {
      // 4. Call Claude API to generate tech specs
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

      const prompt = buildPrompt(onboarding);

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8192,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Claude API error: ${response.status} ${errText}`);
      }

      const result = await response.json() as {
        content: Array<{ type: string; text?: string }>;
      };
      const text = result.content
        .filter((b: { type: string }) => b.type === "text")
        .map((b: { text?: string }) => b.text)
        .join("");

      // 5. Parse the structured response
      const specs = parseSpecs(text);

      // 6. Save to Convex
      await ctx.runMutation(api.techSpecs.updateSpec, {
        id: specId,
        status: "completed",
        ...specs,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      await ctx.runMutation(api.techSpecs.updateSpec, {
        id: specId,
        status: "error",
        error: message,
      });
    }
  },
});

function buildPrompt(onboarding: {
  toolDescription: string;
  projectMode: string;
  userRoles: string;
  accessControl: string;
  keyWorkflows: string;
  approvals: string;
  notifications: string;
}): string {
  return `You are an expert software architect. Based on the following project description, generate a complete technical specification.

## Project Input

**Tool Description:** ${onboarding.toolDescription}
**Project Mode:** ${onboarding.projectMode}
**User Roles:** ${onboarding.userRoles || "Not specified"}
**Access Control:** ${onboarding.accessControl || "Not specified"}
**Key Workflows:** ${onboarding.keyWorkflows || "Not specified"}
**Approvals:** ${onboarding.approvals || "Not specified"}
**Notifications:** ${onboarding.notifications || "Not specified"}

## Instructions

Generate the following sections. Use the exact section headers shown below (including the === delimiters) so the output can be parsed programmatically.

=== VISION ===
A clear product vision statement (2-3 paragraphs).

=== REQUIREMENTS ===
Functional and non-functional requirements as a structured list.

=== ARCHITECTURE ===
System architecture: components, services, data flow, and deployment topology.

=== FRAMEWORKS ===
Recommended technology stack with justifications.

=== TESTS ===
Test strategy: unit, integration, e2e test definitions and acceptance criteria.

=== BACKLOG ===
Actionable backlog: epics broken into user stories with acceptance criteria.

Provide thorough, implementation-ready content for each section.`;
}

function parseSpecs(text: string): {
  vision?: string;
  requirements?: string;
  architecture?: string;
  frameworks?: string;
  tests?: string;
  backlog?: string;
} {
  const sections: Record<string, string> = {};
  const sectionNames = ["VISION", "REQUIREMENTS", "ARCHITECTURE", "FRAMEWORKS", "TESTS", "BACKLOG"];

  for (let i = 0; i < sectionNames.length; i++) {
    const startMarker = `=== ${sectionNames[i]} ===`;
    const startIdx = text.indexOf(startMarker);
    if (startIdx === -1) continue;

    const contentStart = startIdx + startMarker.length;
    let contentEnd = text.length;

    // Find the next section marker
    for (let j = i + 1; j < sectionNames.length; j++) {
      const nextMarker = `=== ${sectionNames[j]} ===`;
      const nextIdx = text.indexOf(nextMarker, contentStart);
      if (nextIdx !== -1) {
        contentEnd = nextIdx;
        break;
      }
    }

    sections[sectionNames[i].toLowerCase()] = text.slice(contentStart, contentEnd).trim();
  }

  return sections;
}
