import Anthropic from "@anthropic-ai/sdk";
import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";
import { ArchNode, ArchEdge } from "@/types/architecture";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const SYSTEM_PROMPT = `You are a software architecture expert at Swiss Life, a Swiss insurance company.

Your task: Given business specifications for a new internal system, design a complete software architecture.

Process:
1. Use query_documents to search the internal knowledge base for relevant context. Search for:
   - Existing systems and APIs you can integrate with or reuse
   - Compliance and legal requirements that constrain the design
   - Approved technology stacks and frameworks
   - Infrastructure and cost guidelines
2. Make 3-5 targeted searches to gather comprehensive context before designing.
3. Once you have sufficient context, call output_architecture exactly once with the complete architecture.

Architecture guidelines:
- Reuse existing Swiss Life systems wherever possible (PAS, Claims Service, HR API, Kong Gateway, etc.)
- Comply with all legal and compliance documents found (data residency, audit logging, SSO, etc.)
- Use Swiss Life approved technology stacks
- Include all major components: frontend, backend services, databases, message queues, external integrations
- Add edge labels to describe communication protocols (REST, Kafka, gRPC, HTTPS)

Node quality rules (IMPORTANT):
- Keep node labels SHORT (2-4 words max, e.g. "API Gateway", "User Service", "Events DB")
- Keep technology values SHORT — just the core tech name (e.g. "PostgreSQL", "Kafka", "Next.js", "ECS Fargate"). Do NOT include regions, hostnames, versions, or deployment details in the technology field.
- Use descriptions sparingly — only add a description if the node's purpose isn't obvious from its label
- Aim for 8-15 nodes total. Combine closely related components into one node rather than creating many small ones (e.g. one "Backend Services" node rather than separate nodes for each microservice, unless they have distinct technology stacks)
- Do NOT set animated on edges — all edges should be static
- Do NOT duplicate information: if a technology appears in the technology field, don't repeat it in the label or description

Do not explain yourself before calling output_architecture. Just search, then output.`;

const TOOLS: Anthropic.Tool[] = [
  {
    name: "query_documents",
    description:
      "Search Swiss Life's internal knowledge base for relevant documents: existing projects and APIs, business processes, legal and compliance policies, approved tech stacks, budget guidelines. Use this to gather context before designing the architecture.",
    input_schema: {
      type: "object" as const,
      properties: {
        search_term: {
          type: "string",
          description: "Natural language search query",
        },
        category: {
          type: "string",
          enum: ["project", "business", "legal", "tech"],
          description: "Optional filter by document category",
        },
        limit: {
          type: "integer",
          description: "Max results to return (default 5, max 10)",
        },
      },
      required: ["search_term"],
    },
  },
  {
    name: "output_architecture",
    description:
      "Emit the final architecture diagram. Call this ONCE when you have gathered sufficient context and are ready to produce the architecture. The nodes and edges will be rendered as an interactive React Flow diagram.",
    input_schema: {
      type: "object" as const,
      properties: {
        nodes: {
          type: "array",
          description: "Architecture nodes (components, services, databases, etc.)",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              type: {
                type: "string",
                enum: ["service", "database", "queue", "gateway", "external", "group"],
              },
              label: { type: "string" },
              description: { type: "string" },
              technology: { type: "string", description: "e.g. PostgreSQL, Kafka, Next.js, ECS Fargate" },
              position: {
                type: "object",
                properties: {
                  x: { type: "number" },
                  y: { type: "number" },
                },
                required: ["x", "y"],
              },
            },
            required: ["id", "type", "label", "position"],
          },
        },
        edges: {
          type: "array",
          description: "Connections between nodes",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              source: { type: "string" },
              target: { type: "string" },
              label: { type: "string", description: "e.g. REST, Kafka, gRPC, HTTPS" },
              animated: { type: "boolean" },
            },
            required: ["id", "source", "target"],
          },
        },
        summary: {
          type: "string",
          description:
            "A 2-3 sentence summary of the architecture decisions made. This seeds the detailed prose explanation.",
        },
      },
      required: ["nodes", "edges", "summary"],
    },
  },
];

function sseEvent(type: string, data: Record<string, unknown>): string {
  return `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: Request) {
  const { businessSpecs } = await req.json();
  const specsString =
    typeof businessSpecs === "string"
      ? businessSpecs
      : JSON.stringify(businessSpecs, null, 2);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const emit = (type: string, data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(sseEvent(type, data)));
      };

      try {
        const messages: Anthropic.MessageParam[] = [
          {
            role: "user",
            content: `Here are the business specifications for a new internal software system at Swiss Life:\n\n${specsString}\n\nPlease research the internal knowledge base and design the appropriate architecture.`,
          },
        ];

        let architectureEmitted = false;
        let architectureSummary = "";
        const MAX_ITER = 8;

        // Agentic tool-calling loop
        for (let i = 0; i < MAX_ITER; i++) {
          const response = await anthropic.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            tools: TOOLS,
            tool_choice: { type: "any" },
            messages,
          });

          // Append assistant response to conversation
          messages.push({ role: "assistant", content: response.content });

          if (response.stop_reason === "tool_use") {
            const toolResults: Anthropic.ToolResultBlockParam[] = [];

            for (const block of response.content) {
              if (block.type !== "tool_use") continue;

              if (block.name === "query_documents") {
                const input = block.input as {
                  search_term: string;
                  category?: string;
                  limit?: number;
                };

                emit("status", { message: `Searching: "${input.search_term}"` });

                const results = await convex.query(anyApi.documents.search, {
                  searchTerm: input.search_term,
                  category: input.category,
                  limit: Math.min(input.limit ?? 5, 10),
                });

                const resultText =
                  results.length === 0
                    ? "No documents found."
                    : results
                        .map(
                          (r: { title: string; category: string; content: string }) =>
                            `## ${r.title} [${r.category}]\n${r.content}`
                        )
                        .join("\n\n---\n\n");

                toolResults.push({
                  type: "tool_result",
                  tool_use_id: block.id,
                  content: resultText,
                });
              } else if (block.name === "output_architecture") {
                const input = block.input as {
                  nodes: ArchNode[];
                  edges: ArchEdge[];
                  summary: string;
                };

                architectureSummary = input.summary;
                emit("architecture", {
                  nodes: input.nodes,
                  edges: input.edges,
                });
                architectureEmitted = true;

                toolResults.push({
                  type: "tool_result",
                  tool_use_id: block.id,
                  content: "Architecture emitted successfully.",
                });
              }
            }

            messages.push({ role: "user", content: toolResults });

            if (architectureEmitted) break;
          } else {
            // stop_reason === "end_turn" — Claude finished without calling output_architecture
            break;
          }
        }

        // Prose phase: stream explanation after graph is emitted
        if (architectureEmitted) {
          const proseStream = await anthropic.messages.stream({
            model: "claude-sonnet-4-6",
            max_tokens: 1024,
            messages: [
              {
                role: "user",
                content: `You just designed a software architecture for a Swiss Life internal system with this summary: "${architectureSummary}"

Now write a detailed explanation of the architecture. Cover:
- The overall architectural pattern and why it fits the requirements
- Key components and their roles
- How existing Swiss Life systems are reused
- Compliance and security measures incorporated
- Data flow through the system
- Any important trade-offs made

Write in clear prose (no bullet points), aimed at a technical architect audience. 3-4 paragraphs.`,
              },
            ],
          });

          for await (const event of proseStream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              emit("prose", { chunk: event.delta.text });
            }
          }
        } else {
          emit("prose", {
            chunk:
              "The architecture could not be generated. Please try again with more detailed specifications.",
          });
        }

        emit("done", {});
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[generate-architecture] Error:", message, err);
        emit("error", { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
