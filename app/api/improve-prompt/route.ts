import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  if (!prompt?.trim()) {
    return Response.json({ improved: prompt });
  }

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `You are helping a user refine a software feature request. Expand the following brief request into a clear, actionable refinement instruction (2–4 sentences). Be specific about what should change and why. Write natural prose — no bullet points, no headers.

User's request: "${prompt}"

Improved version:`,
      },
    ],
  });

  const improved = msg.content[0].type === "text" ? msg.content[0].text.trim() : prompt;
  return Response.json({ improved });
}
