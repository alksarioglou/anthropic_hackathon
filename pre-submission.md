# Pre-Submission — matura

## Stages Covered

matura covers the **complete SDLC workflow** from idea to implementation-ready plan:

| Stage | Status | Description |
|-------|--------|-------------|
| **Idea Intake** | Working | User describes their software idea in natural language during onboarding |
| **Vision** | Working | AI generates a product vision statement from the idea |
| **Requirements** | Working | Functional and non-functional requirements extracted and structured |
| **Architecture** | Working | System architecture with interactive React Flow diagram, generated via agentic tool-use loop that queries an internal knowledge base |
| **Frameworks** | Working | Technology stack recommendations with justifications |
| **Backlog** | Working | Product backlog organized into Epics and User Stories with acceptance criteria |
| **Tests** | Working | Test definitions (unit, integration, E2E) with preconditions and expected results |
| **Cost Estimate** | Working | Development effort breakdown by phase with T-shirt sizing |
| **Competitive Analysis** | Working | Comparison with existing solutions and positioning statement |
| **Retro-Feedback Loop** | Working | Refinement at any stage propagates changes across all affected artifacts |

## What Works

- **End-to-end flow**: Sign up → onboarding → artifact generation → refinement → dashboard
- **AI-powered onboarding**: The onboarding agent pre-fills setup fields (user roles, access control, workflows, approvals, notifications) based on the user's idea description
- **Streaming artifact generation**: All 8 SDLC artifacts are generated sequentially with real-time streaming to the UI via NDJSON
- **Retro-feedback loop**: Users can refine any artifact with natural language instructions. The system performs impact analysis to determine affected artifacts, then re-generates them while keeping everything aligned
- **Agentic architecture generation**: A tool-use agent queries the internal knowledge base (Swiss Life systems, compliance docs, tech stacks) before designing the architecture, then outputs an interactive diagram
- **Architecture visualization**: Interactive React Flow diagrams with auto-layout (dagre), color-coded node types, and a streaming prose explanation
- **Three views**: Business view (Vision, Requirements, Cost Estimate, Competitive Analysis), Technical view (Architecture, Frameworks, Backlog, Tests), and Architecture view (interactive diagram)
- **Persistent storage**: All projects, onboarding data, and generated artifacts are stored in Convex and persist across sessions
- **Authentication**: Clerk-based auth with protected routes
- **Dashboard**: Structured view of all generated artifacts with mode-specific panels (Internal vs External)
- **Project management**: Home page lists all past flows with quick access to workspace and dashboard

## How Agentic AI Is Used

matura uses **7 specialized AI agents** powered by Claude, each responsible for a distinct SDLC stage:

### 1. Onboarding Prefill Agent (`/api/onboarding-prefill`)
- **Model**: Claude Sonnet 4
- **Role**: Takes the user's raw idea and generates suggested values for 5 onboarding fields (user roles, access control, key workflows, approvals, notifications)
- **Streaming**: NDJSON streaming — each field streams token-by-token to the UI

### 2. SDLC Generation Pipeline (`/api/generate`)
- **Model**: Claude Sonnet 4
- **Role**: Sequentially generates 8 artifacts (Vision → Requirements → Architecture → Frameworks → Backlog → Tests → Cost Estimate → Competitive Analysis)
- **Streaming**: Each artifact streams token-by-token via NDJSON; the UI updates in real-time as each artifact completes

### 3. Architecture Agent (`/api/generate-architecture`)
- **Model**: Claude Sonnet 4.6
- **Role**: The most agentic component. Uses a **tool-use loop** with two tools:
  - `query_documents` — searches the internal knowledge base (Convex full-text search) for existing systems, compliance requirements, approved tech stacks
  - `output_architecture` — emits the final architecture as structured nodes and edges for React Flow
- **Process**: Makes 3-5 research queries, then produces the architecture diagram. Follows up with a streaming prose explanation of architectural decisions
- **Loop**: Up to 8 iterations of tool calling before finalizing

### 4. Feedback & Alignment Agent (`/api/feedback`)
- **Model**: Claude Sonnet 4.6 (impact analysis) + Claude Haiku 4.5 (artifact updates)
- **Role**: The retro-feedback loop. When a user refines any artifact:
  1. **Impact analysis** — determines which other artifacts are affected (using both AI reasoning and a dependency graph fallback)
  2. **Propagation** — re-generates each affected artifact incorporating the refinement, streaming updates to the UI
- **Dependency graph**: Maintains upstream/downstream relationships between all artifact types to ensure no artifact is missed

### 5. Field Refinement Agent (`/api/field-refine`)
- **Model**: Claude Sonnet 4
- **Role**: Inline refinement of individual onboarding fields via streaming

### Key Agentic Properties
- **Autonomous decision-making**: The architecture agent decides what to search for and how many queries to make
- **Tool use**: The architecture agent uses structured tool calls to interact with the knowledge base
- **Multi-step reasoning**: Impact analysis determines cascading effects before propagating changes
- **Bidirectional feedback**: Changes propagate both upstream and downstream through the SDLC pipeline
- **Human-in-the-loop**: Users review generated artifacts and provide refinement instructions; the AI handles alignment

## How to Run

```bash
# Install dependencies
pnpm install

# Set environment variables in .env.local:
#   ANTHROPIC_API_KEY=sk-ant-...
#   NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud

# Terminal 1: Start Convex backend
npx convex dev

# Terminal 2: Start Next.js dev server
pnpm dev

# Open http://localhost:3000
```


## Known Limitations

- **Rate limiting**: Heavy use can hit Anthropic API rate limits. The system implements exponential backoff (up to 4 retries), but sustained rapid generation may still fail temporarily.
- **Architecture diagram layout**: Auto-layout via dagre works well for most graphs, but very large architectures may need manual repositioning.
- **No diff/PR view for refinements**: The feedback loop updates artifacts in-place. A side-by-side diff view showing before/after changes is planned but not yet implemented.
