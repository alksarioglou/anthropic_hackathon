"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserButton } from "@clerk/nextjs";
import { MaturaLogo } from "@/components/MaturaLogo";

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
    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border last:border-b-0 items-center hover:bg-card-bg transition-colors">
      <div className="col-span-4 min-w-0">
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
        <span className={`inline-flex text-xs px-3 py-1 rounded-full font-medium ${
          project.mode === "internal" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
        }`}>
          {project.mode === "internal" ? "Internal" : "External"}
        </span>
      </div>

      <div className="col-span-2">
        <p className="text-sm text-foreground-secondary">{formatDate(project.createdAt)}</p>
      </div>

      <div className="col-span-4 flex items-center justify-end gap-2">
        <button
          onClick={() => onNavigate(`/workspace?projectId=${project._id}`)}
          className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-foreground-secondary hover:text-foreground hover:border-foreground-muted transition-colors"
        >
          Workspace
        </button>
        <button
          onClick={() => onNavigate(`/dashboard?projectId=${project._id}`)}
          className="rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const projects = useQuery(api.projects.list);
  const [idea, setIdea] = useState("");

  function handleStart() {
    const trimmed = idea.trim();
    if (!trimmed) return;
    sessionStorage.setItem("matura_idea", trimmed);
    router.push("/onboarding");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <nav className="border-b border-border bg-nav-bg">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
          <MaturaLogo className="h-7" />
          <UserButton />
        </div>
      </nav>

      <main className="flex flex-1 px-4 py-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto rounded-2xl bg-card-bg min-h-[calc(100vh-100px)] px-8 sm:px-16 lg:px-24 py-12">

          {/* Idea input */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">What do you want to build?</h1>
            <p className="text-foreground-secondary text-lg leading-relaxed mb-6">
              Describe your software idea and we'll generate a complete implementation plan in minutes.
            </p>
            <div className="rounded-xl border border-border bg-background p-4">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleStart(); }}
                placeholder="e.g. An internal portal where employees can report IT incidents, support teams triage and resolve them, and fixes become tracked change requests with approval workflows…"
                rows={4}
                className="w-full bg-transparent text-foreground placeholder:text-foreground-muted resize-none outline-none text-sm leading-relaxed"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <p className="text-xs text-foreground-muted">⌘+Enter to start</p>
                <button
                  onClick={handleStart}
                  disabled={!idea.trim()}
                  className="rounded-full bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Start →
                </button>
              </div>
            </div>
          </div>

          {/* Past flows */}
          {projects && projects.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-5">Your Flows</h2>
              <div className="rounded-xl border border-border bg-background overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  <div className="col-span-4">Project</div>
                  <div className="col-span-2">Mode</div>
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
        </div>
      </main>
    </div>
  );
}
