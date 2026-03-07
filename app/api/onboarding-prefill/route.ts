// Stage 1 — Onboarding prefill agent
//
// Given the user's tool description and project mode, generates suggested
// answers for the remaining onboarding fields so users don't start from scratch.
//
// Streams NDJSON events:
//   { field: "userRoles",     chunk: "..." }
//   { field: "userRoles",     done: true }
//   { field: "accessControl", chunk: "..." }
//   { field: "accessControl", done: true }
//   { field: "keyWorkflows",  chunk: "..." }
//   { field: "keyWorkflows",  done: true }
//   { field: "approvals",     chunk: "..." }
//   { field: "approvals",     done: true }
//   { field: "notifications", chunk: "..." }
//   { field: "notifications", done: true }
//   { event: "complete" }
//   { event: "error", message: "..." }

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

const FIELDS: Array<{
  key: string;
  label: string;
  prompt: (desc: string, mode: string) => string;
}> = [
  {
    key: "userRoles",
    label: "User Types",
    prompt: (desc, _mode) =>
      `Based on this tool description, list the types of users who would use this tool (e.g. Admin, Manager, Regular Employee). Be concise — one line per role with a brief explanation.

Tool description: ${desc}

Respond with just the user types list, no preamble.`,
  },
  {
    key: "accessControl",
    label: "Access Control",
    prompt: (desc, _mode) =>
      `Based on this tool description, describe what each user type should be allowed to do (permissions and access control). Be concise and specific.

Tool description: ${desc}

Respond with just the access control rules, no preamble.`,
  },
  {
    key: "keyWorkflows",
    label: "Key Workflows",
    prompt: (desc, _mode) =>
      `Based on this tool description, describe the main step-by-step processes (workflows) the tool should support. Use arrows (→) to show flow. Be specific.

Tool description: ${desc}

Respond with just the workflow descriptions, no preamble.`,
  },
  {
    key: "approvals",
    label: "Approvals",
    prompt: (desc, _mode) =>
      `Based on this tool description, identify any approval or sign-off requirements (e.g. who needs to approve what, under what conditions). If none are obvious, suggest sensible defaults.

Tool description: ${desc}

Respond with just the approval rules, no preamble.`,
  },
  {
    key: "notifications",
    label: "Notifications",
    prompt: (desc, _mode) =>
      `Based on this tool description, list the notifications and reminders the tool should send (e.g. email on assignment, alert when overdue, daily digest for managers). Be specific.

Tool description: ${desc}

Respond with just the notification list, no preamble.`,
  },
];

async function* streamField(
  fieldKey: string,
  prompt: string,
  attempt = 0
): AsyncGenerator<string> {
  try {
    const stream = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
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
      const waitMs = Math.min(8_000 * Math.pow(2, attempt), 60_000);
      await new Promise((r) => setTimeout(r, waitMs));
      yield* streamField(fieldKey, prompt, attempt + 1);
    } else {
      throw err;
    }
  }
}

export async function POST(request: NextRequest) {
  const { toolDescription, projectMode } = await request.json() as {
    toolDescription: string;
    projectMode: string;
  };

  if (!toolDescription?.trim()) {
    return new Response(
      JSON.stringify({ event: "error", message: "Tool description is required" }) + "\n",
      { status: 400, headers: { "Content-Type": "application/x-ndjson" } }
    );
  }

  const encoder = new TextEncoder();

  const outStream = new ReadableStream({
    async start(controller) {
      function emit(obj: object) {
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      }

      try {
        for (const field of FIELDS) {
          const prompt = field.prompt(toolDescription, projectMode);
          for await (const chunk of streamField(field.key, prompt)) {
            emit({ field: field.key, chunk });
          }
          emit({ field: field.key, done: true });
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
