"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { UserButton } from "@clerk/nextjs";
import { MaturaLogo } from "@/components/MaturaLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const DEMO_USE_CASES = [
  {
    complexity: "Simple",
    label: "Team Task Tracker",
    tagline: "Small internal team productivity",
    idea: "We need a small internal web app where a team can create tasks, assign owners, set due dates, track status, and get reminders. Managers need a Kanban board view and burndown charts. Tasks should support sub-tasks, file attachments, and comment threads. Email notifications for assignments and approaching deadlines.",
    color: "emerald" as const,
  },
  {
    complexity: "Medium",
    label: "IT Incident Portal",
    tagline: "Incident & change management",
    idea: "We need an internal portal where employees can report IT incidents, support teams can triage and resolve them, and important fixes can become tracked change requests with approvals and implementation planning. The system should support multiple user roles, SLA tracking, severity classification, approval workflows, audit history, and email notifications.",
    color: "violet" as const,
  },
];

const EXAMPLES = [
  {
    label: "Employee Onboarding",
    text: "A self-service onboarding platform for new hires. HR creates checklists per department. New employees follow a guided checklist with due dates. Managers see completion status with automatic reminders and a final HR sign-off.",
  },
  {
    label: "Contract Approvals",
    text: "A tool for routing contracts through multi-stage approval workflows. Legal drafts, Finance reviews, then C-level approves. Each stage has configurable deadlines, comment threads, and version history. Full audit log required.",
  },
];

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PencilIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function ProjectRow({ project, onNavigate }: {
  project: { _id: string; name: string; description?: string; mode: string; createdAt: number };
  onNavigate: (path: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const updateProject = useMutation(api.projects.update);
  const inputRef = useRef<HTMLInputElement>(null);

  async function commitRename() {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== project.name) {
      await updateProject({ id: project._id as Parameters<typeof updateProject>[0]["id"], name: trimmed });
    } else {
      setEditName(project.name);
    }
    setIsEditing(false);
  }

  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border last:border-b-0 items-center hover:bg-card-bg transition-colors animate-fade-in">
      <div className="col-span-6 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") { setEditName(project.name); setIsEditing(false); }
            }}
            className="w-full text-sm font-medium text-foreground bg-background border border-primary rounded px-2 py-0.5 outline-none"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-1.5 group">
            <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
            <button
              onClick={() => { setIsEditing(true); setTimeout(() => inputRef.current?.select(), 10); }}
              className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity text-foreground-muted"
            >
              <PencilIcon />
            </button>
          </div>
        )}
        {project.description && (
          <p className="text-xs text-foreground-muted truncate mt-0.5">{project.description}</p>
        )}
      </div>

      <div className="col-span-2">
        <p className="text-sm text-foreground-secondary">{formatDate(project.createdAt)}</p>
      </div>

      <div className="col-span-4 flex items-center justify-end gap-2">
        <button
          onClick={() => onNavigate(`/workspace?projectId=${project._id}`)}
          className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-foreground-secondary hover:text-foreground hover:border-foreground-muted transition-colors"
        >
          Open →
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useUser();
  const projects = useQuery(api.projects.list);
  const [idea, setIdea] = useState("");

  const firstName = user?.firstName ?? user?.username ?? null;

  function handleStart() {
    const trimmed = idea.trim();
    if (!trimmed) return;
    sessionStorage.setItem("matura_idea", trimmed);
    router.push("/onboarding");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background animate-fade-in">
      <nav className="border-b border-border bg-nav-bg">
        <div className="flex items-center justify-between h-14 px-6 w-full">
          <MaturaLogo className="h-7" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="flex flex-1 justify-center px-6 py-12">
        <div className="w-full max-w-3xl">

          {/* Idea input */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {firstName ? `What do you want to build, ${firstName}?` : "What do you want to build?"}
            </h1>
            <p className="text-foreground-secondary text-base leading-relaxed mb-6">
              Describe your software idea and we&apos;ll generate a complete implementation plan in minutes.
            </p>

            {/* Input area */}
            <div className="rounded-xl border border-border bg-background p-4">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleStart(); }}
                placeholder="Describe your software idea…"
                rows={5}
                className="w-full bg-transparent text-foreground placeholder:text-foreground-muted resize-none outline-none text-sm leading-relaxed"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <p className="text-xs text-foreground-muted">⌘+Enter to start</p>
                <button
                  onClick={handleStart}
                  disabled={!idea.trim()}
                  className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Start →
                </button>
              </div>
            </div>

            {/* Demo use cases + other examples */}
            <div className="mt-3 flex flex-wrap items-start gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted self-center mr-1">Try:</span>
              {DEMO_USE_CASES.map((uc) => (
                <button
                  key={uc.label}
                  onClick={() => setIdea(uc.idea)}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 border text-xs font-medium transition-all duration-150 group ${
                    idea === uc.idea
                      ? uc.color === "emerald"
                        ? "border-emerald-500/70 bg-emerald-500/15 text-emerald-700"
                        : "border-violet-500/70 bg-violet-500/15 text-violet-700"
                      : uc.color === "emerald"
                        ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-700 hover:border-emerald-500/70 hover:bg-emerald-500/12"
                        : "border-violet-500/40 bg-violet-500/5 text-violet-700 hover:border-violet-500/70 hover:bg-violet-500/12"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${uc.color === "emerald" ? "bg-emerald-500" : "bg-violet-500"}`} />
                  {uc.label}
                  <span className="text-[10px] font-normal opacity-70">{uc.complexity}</span>
                </button>
              ))}
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => setIdea(ex.text)}
                  className="rounded-full px-3 py-1.5 border border-border text-xs text-foreground-secondary hover:border-foreground-muted hover:text-foreground transition-colors"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Past flows */}
          {projects && projects.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-5">Your Flows</h2>
              <div className="rounded-xl border border-border bg-background overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  <div className="col-span-6">Project</div>
                  <div className="col-span-2">Created</div>
                  <div className="col-span-4 text-right">Actions</div>
                </div>
                {projects.map((project) => (
                  <ProjectRow key={project._id} project={project} onNavigate={router.push} />
                ))}
              </div>
            </>
          )}

          {projects !== undefined && projects.length === 0 && (
            <p className="text-sm text-foreground-muted text-center py-8">
              Your flows will appear here once you create one.
            </p>
          )}

          {/* Powered by Claude */}
          <p className="mt-12 text-xs text-foreground-muted text-center">
            Powered by{" "}
            <span className="font-medium text-foreground-secondary">Claude</span>
            {" "}· Built at the Anthropic Hackathon for Swiss Life
          </p>
        </div>
      </main>
    </div>
  );
}
