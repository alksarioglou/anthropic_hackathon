import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  const { idea } = await req.json();
  const client = new Anthropic();
  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 30,
    messages: [{
      role: "user",
      content: `Generate a concise project name (3-5 words) for this software idea. Reply with ONLY the project name, no quotes, no punctuation at the end:\n\n${idea}`,
    }],
  });
  const title = (msg.content[0] as { type: "text"; text: string }).text.trim();
  return NextResponse.json({ title });
}
