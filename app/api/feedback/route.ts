// Stage 3 — Feedback & Retro-Alignment Loop (Owner: Damiano)
//
// Streaming NDJSON endpoint. Events emitted in order:
//   { event: "impact", affectedArtifacts: [...], reasoning: "..." }
//   { event: "chunk",  artifactType: "vision", chunk: "..." }     (repeats)
//   { event: "artifact_done", artifactType: "vision" }
//   { event: "complete" }
//   { event: "error", message: "..." }

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import type { ArtifactType, Artifacts, FeedbackRequest } from "@/types";
import { ARTIFACT_LABELS } from "@/types";

const client = new Anthropic();

// Dependency graph — fallback when Claude impact analysis fails.
const DOWNSTREAM_DEPS: Partial<Record<ArtifactType, ArtifactType[]>> = {
  vision: ["requirements", "competitive_analysis"],
  requirements: ["architecture", "backlog", "tests", "cost_estimate", "competitive_analysis"],
  architecture: ["frameworks", "backlog", "tests"],
  frameworks: ["backlog"],
  backlog: ["tests", "cost_estimate"],
  tests: [],
  cost_estimate: [],
  competitive_analysis: [],
};

const UPSTREAM_DEPS: Partial<Record<ArtifactType, ArtifactType[]>> = {
  vision: [],
  requirements: ["vision"],
  architecture: ["requirements", "vision"],
  frameworks: ["architecture"],
  backlog: ["requirements", "architecture"],
  tests: ["requirements", "backlog"],
  cost_estimate: ["requirements", "backlog"],
  competitive_analysis: ["vision", "requirements"],
};

function buildArtifactSummary(artifacts: Artifacts): string {
  return Object.entries(artifacts)
    .filter(([, content]) => content?.trim())
    .map(([type, content]) => `## ${ARTIFACT_LABELS[type as ArtifactType] ?? type}\n${content}`)
    .join("\n\n---\n\n");
}

async function* streamArtifactUpdate(
  artifactType: ArtifactType,
  targetArtifact: ArtifactType,
  refinement: string,
  currentArtifacts: Artifacts,
  mode: string,
  attempt = 0
): AsyncGenerator<string> {
  const isTarget = artifactType === targetArtifact;
  const prompt = `You are an SDLC alignment agent. Update the "${ARTIFACT_LABELS[artifactType]}" artifact to incorporate the following refinement${isTarget ? " (this is the directly modified artifact)" : " (this artifact is transitively affected)"}.

Refinement to "${ARTIFACT_LABELS[targetArtifact]}": "${refinement}"

Current "${ARTIFACT_LABELS[artifactType]}" content:
${currentArtifacts[artifactType] ?? "(not yet generated)"}

All current SDLC artifacts for context:
${buildArtifactSummary(currentArtifacts)}

${mode === "external" ? "This is an external/cloud project." : "This is an internal/on-premise project."}

Provide ONLY the updated artifact content. Preserve the existing format and structure. Integrate the refinement naturally — do not add meta-commentary about what changed.`;

  try {
    const stream = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      stream: true,
      messages: [{ role: "user", content: prompt }],
    });
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield event.delta.text;
      }
    }
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status;
    if (status === 429 && attempt < 4) {
      const waitMs = Math.min(15_000 * Math.pow(2, attempt), 120_000);
      await new Promise((r) => setTimeout(r, waitMs));
      yield* streamArtifactUpdate(artifactType, targetArtifact, refinement, currentArtifacts, mode, attempt + 1);
    } else {
      throw err;
    }
  }
}

export async function POST(request: NextRequest) {
  const body: FeedbackRequest = await request.json();
  const { refinement, targetArtifact, currentArtifacts, mode } = body;

  if (!refinement?.trim()) {
    return new Response(JSON.stringify({ event: "error", message: "Refinement text is required" }) + "\n", {
      status: 400,
      headers: { "Content-Type": "application/x-ndjson" },
    });
  }

  const encoder = new TextEncoder();
  const existingTypes = Object.keys(currentArtifacts) as ArtifactType[];

  const outStream = new ReadableStream({
    async start(controller) {
      function emit(obj: object) {
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      }

      try {
        // --- Step 1: Impact analysis ---
        const impactPrompt = `You are an SDLC alignment agent. A user refined the "${ARTIFACT_LABELS[targetArtifact]}" artifact.

Refinement: "${refinement}"

Current artifacts: ${existingTypes.join(", ")}

Which artifacts (from this list only) need updating? Consider both upstream and downstream effects. Always include "${targetArtifact}" itself.

Respond with JSON only, no markdown:
{"affectedArtifacts":["list"],"reasoning":"brief explanation"}`;

        const impactMsg = await client.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 512,
          messages: [{ role: "user", content: impactPrompt }],
        });

        const impactText = impactMsg.content[0].type === "text" ? impactMsg.content[0].text : "{}";

        let affectedArtifacts: ArtifactType[] = [];
        let reasoning = "";
        try {
          const parsed = JSON.parse(impactText);
          affectedArtifacts = ((parsed.affectedArtifacts ?? []) as string[]).filter((t) =>
            existingTypes.includes(t as ArtifactType)
          ) as ArtifactType[];
          reasoning = parsed.reasoning ?? "";
        } catch {
          // Fallback: dependency graph
          const downstream = DOWNSTREAM_DEPS[targetArtifact] ?? [];
          const upstream = UPSTREAM_DEPS[targetArtifact] ?? [];
          affectedArtifacts = [...new Set([targetArtifact, ...downstream, ...upstream])].filter((t) =>
            existingTypes.includes(t)
          ) as ArtifactType[];
          reasoning = "Determined via dependency graph (fallback).";
        }

        if (!affectedArtifacts.includes(targetArtifact)) {
          affectedArtifacts = [targetArtifact, ...affectedArtifacts];
        }

        emit({ event: "impact", affectedArtifacts, reasoning });

        // --- Step 2: Stream each affected artifact update sequentially ---
        for (const artifactType of affectedArtifacts) {
          let accumulated = "";
          for await (const chunk of streamArtifactUpdate(
            artifactType,
            targetArtifact,
            refinement,
            currentArtifacts,
            mode
          )) {
            accumulated += chunk;
            emit({ event: "chunk", artifactType, chunk });
          }
          emit({ event: "artifact_done", artifactType, content: accumulated });
        }

        emit({ event: "complete" });
      } catch (err) {
        emit({ event: "error", message: String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(outStream, {
    headers: { "Content-Type": "application/x-ndjson" },
  });
}
