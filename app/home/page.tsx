"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
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

export default function HomePage() {
  const router = useRouter();
  const projects = useQuery(api.projects.list);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav — matches onboarding */}
      <nav className="border-b border-border bg-nav-bg">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
          <MaturaLogo className="h-7" />
          <UserButton />
        </div>
      </nav>

      {/* Main content area — same card wrapper as onboarding */}
      <main className="flex flex-1 px-4 py-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto rounded-2xl bg-card-bg min-h-[calc(100vh-100px)] px-8 sm:px-16 lg:px-24 py-12">
          {/* Welcome heading */}
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome to matura
          </h1>
          <p className="text-foreground-secondary text-lg leading-relaxed mb-10">
            Transform any software idea into a complete, implementation-ready plan.
          </p>

          {/* Stats banner */}
          <div className="rounded-xl border border-border bg-background px-6 py-5 flex items-center justify-between mb-10">
            <div>
              <p className="text-foreground-muted text-sm">Total Projects</p>
              <p className="text-3xl font-bold text-foreground">
                {projects?.length ?? "\u2014"}
              </p>
            </div>
            <button
              onClick={() => router.push("/onboarding")}
              className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              New Flow
            </button>
          </div>

          {/* Tip banners */}
          <div className="space-y-3 mb-10">
            <div className="rounded-xl border border-border bg-background px-5 py-3.5 flex items-center gap-3">
              <span className="text-accent text-lg">&#x2728;</span>
              <p className="text-sm text-foreground-secondary">
                Each flow generates vision, requirements, architecture, backlog, tests, cost estimates, and competitive analysis.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background px-5 py-3.5 flex items-center gap-3">
              <span className="text-accent text-lg">&#x1F501;</span>
              <p className="text-sm text-foreground-secondary">
                Refine any artifact in the workspace and all related specs update automatically via the retro-feedback loop.
              </p>
            </div>
          </div>

          {/* Projects table */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-foreground">Your Flows</h2>
            <button
              onClick={() => router.push("/onboarding")}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Create New Flow
            </button>
          </div>

          {projects === undefined && (
            <div className="rounded-xl border border-border bg-background p-12 text-center">
              <p className="text-foreground-muted text-sm">Loading projects...</p>
            </div>
          )}

          {projects && projects.length === 0 && (
            <div className="rounded-xl border border-border bg-background p-12 text-center">
              <p className="text-foreground-muted text-sm mb-4">
                No flows yet. Start your first one to see it here.
              </p>
              <button
                onClick={() => router.push("/onboarding")}
                className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Create Your First Flow
              </button>
            </div>
          )}

          {projects && projects.length > 0 && (
            <div className="rounded-xl border border-border bg-background overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-xs font-medium text-foreground-muted uppercase tracking-wider">
                <div className="col-span-4">Project</div>
                <div className="col-span-2">Mode</div>
                <div className="col-span-2">Created</div>
                <div className="col-span-4 text-right">Actions</div>
              </div>

              {/* Table rows */}
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border-light last:border-b-0 items-center hover:bg-card-bg transition-colors"
                >
                  {/* Name + description */}
                  <div className="col-span-4 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {project.name}
                    </p>
                    {project.description && (
                      <p className="text-xs text-foreground-muted truncate mt-0.5">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Mode badge */}
                  <div className="col-span-2">
                    <span
                      className={`inline-flex text-xs px-3 py-1 rounded-full font-medium ${
                        project.mode === "internal"
                          ? "bg-accent/10 text-accent"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {project.mode === "internal" ? "Internal" : "External"}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="col-span-2">
                    <p className="text-sm text-foreground-secondary">
                      {formatDate(project.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-4 flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        router.push(`/workspace?projectId=${project._id}`)
                      }
                      className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-foreground-secondary hover:text-foreground hover:border-foreground-muted transition-colors"
                    >
                      Workspace
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/dashboard?projectId=${project._id}`)
                      }
                      className="rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
                    >
                      Dashboard
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
