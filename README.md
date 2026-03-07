# matura - Agentic AI SDLC Planner

**matura** transforms a rough software idea into a complete, implementation-ready software plan using Agentic AI. Built for the Swiss Life Claude Builders Hackathon.

The system guides users through the full SDLC workflow:

**Idea → Vision → Requirements → Architecture → Backlog → Tests**

All artifacts stay aligned through a retro-feedback loop — changes at any stage propagate across all others automatically.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Backend**: Convex (real-time database + server functions)
- **AI Engine**: Claude (Anthropic SDK) — Sonnet 4, Sonnet 4.6, Haiku 4.5
- **Auth**: Clerk (keyless mode)
- **Visualization**: React Flow (architecture diagrams)

## Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- An Anthropic API key
- A Convex account (free at [convex.dev](https://convex.dev))

## Setup & Run

```bash
# 1. Clone the repository
git clone <repo-url>
cd anthropic_hackathon

# 2. Install dependencies
pnpm install

# 3. Configure environment variables
#    Create a .env.local file with:

# Required variables in .env.local:
#   ANTHROPIC_API_KEY=sk-ant-...
#   NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud

# 4. Start Convex backend (in one terminal)
npx convex dev

# 5. Start Next.js dev server (in another terminal)
pnpm dev

# 6. Open http://localhost:3000
```

## Project Structure

```
app/
  page.tsx              # Landing page with Clerk sign-up
  home/page.tsx         # Dashboard — list all project flows
  onboarding/page.tsx   # Guided onboarding wizard (Stage 1)
  workspace/page.tsx    # Artifact generation & refinement (Stage 2 + 3)
  dashboard/page.tsx    # Business/Technical dashboard view
  api/
    generate/           # SDLC artifact generation pipeline
    feedback/           # Retro-feedback alignment loop
    generate-architecture/  # Agentic architecture generation (tool use)
    onboarding-prefill/ # AI-powered onboarding field suggestions
    field-refine/       # Inline field refinement via streaming

convex/
  schema.ts             # Database schema (projects, artifacts, onboarding, etc.)
  projects.ts           # Project CRUD operations
  artifacts.ts          # Artifact storage and retrieval
  onboarding.ts         # Onboarding data persistence
  documents.ts          # Internal knowledge base (for architecture agent)
  techSpecs.ts          # Legacy tech specs generation
  seed.ts               # Knowledge base seed data

components/
  ArchGraph.tsx         # Interactive React Flow architecture diagram
  ProsePanel.tsx        # Streaming prose explanation panel
  TechStackLegend.tsx   # Architecture diagram legend
  MaturaLogo.tsx        # Brand logo component
```

## Available Scripts

```bash
pnpm dev          # Start Next.js dev server (localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
npx convex dev    # Start Convex dev server (run in parallel)
npx convex deploy # Deploy Convex functions to production
```

## How It Works

1. **Sign up / Sign in** at the landing page
2. **Create a new flow** from the home dashboard
3. **Onboarding** — describe your software idea; the AI pre-fills onboarding fields (user roles, workflows, approvals, notifications)
4. **Workspace** — the system generates all SDLC artifacts (Vision, Requirements, Architecture, Frameworks, Backlog, Tests, Cost Estimate, Competitive Analysis) using Claude
5. **Refine** — click any artifact card, add a refinement instruction, and the feedback loop updates all affected artifacts automatically
6. **Architecture view** — an agentic tool-use flow queries the internal knowledge base and produces an interactive architecture diagram
7. **Dashboard** — view generated artifacts in a structured business or technical dashboard

## Team

Built by Alkinoos, Jannis, and Damiano for the Swiss Life Claude Builders Hackathon 2025.
