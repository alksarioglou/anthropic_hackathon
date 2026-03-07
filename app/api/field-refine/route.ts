import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const { currentValue, refinement } = await req.json();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const msgStream = client.messages.stream({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [{
            role: "user",
            content: `Here is a text field value:\n\n${currentValue}\n\nApply this refinement instruction: ${refinement}\n\nReturn ONLY the updated text, no explanation or preamble.`,
          }],
        });
        for await (const event of msgStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(JSON.stringify({ chunk: event.delta.text }) + "\n"));
          }
        }
        controller.enqueue(encoder.encode(JSON.stringify({ done: true }) + "\n"));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(JSON.stringify({ error: message }) + "\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson" } });
}
