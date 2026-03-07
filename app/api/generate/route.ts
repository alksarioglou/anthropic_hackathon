// Generation pipeline — produces all SDLC artifacts for both views.

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { GenerateRequest, ArtifactType } from "@/types";

const client = new Anthropic();

const ARTIFACT_PROMPTS: Record<
  ArtifactType,
  (idea: string, mode: string) => string
> = {
  vision: (idea) =>
    `Write a concise product vision statement (3-5 sentences) for the following software idea: "${idea}". Focus on the problem solved, target users, and key value proposition.`,

  requirements: (idea) =>
    `List functional and non-functional requirements for: "${idea}". Format as two sections: "Functional Requirements" (numbered list) and "Non-Functional Requirements" (numbered list). Be specific and concrete.`,

  architecture: (idea) =>
    `Propose a system architecture for: "${idea}". Include: components, data flow, key design decisions, and scalability considerations. Use clear headings.`,

  frameworks: (idea) =>
    `Recommend a tech stack and frameworks for: "${idea}". List: Frontend, Backend, Database, Infrastructure, and Testing tools with brief justifications.`,

  backlog: (idea) =>
    `Create an initial product backlog for: "${idea}". Organize into Epics with User Stories underneath each. Format each story as: "As a [user], I want [goal] so that [benefit]." Include acceptance criteria for each story.`,

  tests: (idea) =>
    `Define test cases for: "${idea}". Include: unit tests, integration tests, and end-to-end test scenarios. For each, provide: test name, preconditions, steps, and expected result.`,

  competitive_analysis: (idea) =>
    `Perform a competitive analysis for: "${idea}". Identify 3-4 similar existing products/tools. For each: strengths, weaknesses, and how our solution differentiates. End with a positioning statement.`,

  cost_estimate: (idea) =>
    `Estimate development cost and complexity for: "${idea}". Break down by phase: Discovery, Development (Backend, Frontend, Testing), Deployment. Provide T-shirt sizes (S/M/L/XL) and estimated person-days for each. Include assumptions.`,
};

const ALL_ARTIFACT_TYPES: ArtifactType[] = [
  "vision",
  "requirements",
  "architecture",
  "frameworks",
  "backlog",
  "tests",
  "cost_estimate",
  "competitive_analysis",
];

async function* streamArtifact(
  type: ArtifactType,
  idea: string,
  mode: string,
  attempt = 0
): AsyncGenerator<string> {
  try {
    const prompt = ARTIFACT_PROMPTS[type](idea, mode);
    const stream = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      stream: true,
      messages: [{ role: "user", content: prompt }],
    });
    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status;
    if (status === 429 && attempt < 4) {
      const waitMs = Math.min(15_000 * Math.pow(2, attempt), 120_000);
      await new Promise((r) => setTimeout(r, waitMs));
      yield* streamArtifact(type, idea, mode, attempt + 1);
    } else {
      throw err;
    }
  }
}

export async function POST(request: NextRequest) {
  const body: GenerateRequest = await request.json();
  const { idea, mode } = body;

  if (!idea?.trim()) {
    return NextResponse.json({ error: "Idea is required" }, { status: 400 });
  }

  const encoder = new TextEncoder();

  // Process sequentially; stream token chunks so the UI updates word-by-word.
  const outStream = new ReadableStream({
    async start(controller) {
      try {
        for (const type of ALL_ARTIFACT_TYPES) {
          for await (const chunk of streamArtifact(type, idea, mode)) {
            controller.enqueue(
              encoder.encode(JSON.stringify({ type, chunk }) + "\n")
            );
          }
          // Signal that this artifact is complete
          controller.enqueue(
            encoder.encode(JSON.stringify({ type, done: true }) + "\n")
          );
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(JSON.stringify({ error: String(err) }) + "\n")
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(outStream, {
    headers: { "Content-Type": "application/x-ndjson" },
  });
}
