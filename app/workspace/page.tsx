"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { UserButton } from "@clerk/nextjs";
import { MaturaLogo } from "@/components/MaturaLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Artifacts, ArtifactType, Project } from "@/types";
import { BUSINESS_ARTIFACTS, TECH_ARTIFACTS } from "@/types";
import { ArchGraph } from "@/components/ArchGraph";
import { ProsePanel } from "@/components/ProsePanel";
import { TechStackLegend } from "@/components/TechStackLegend";
import type { ArchitectureGraph } from "@/types/architecture";
import { ArtifactCard } from "./components/ArtifactCard";
import { ArtifactModal } from "./components/ArtifactModal";
import { IdeaPanel } from "./components/IdeaPanel";
import { SidebarViewSwitch } from "./components/SidebarViewSwitch";
import { GlobalRefineBar } from "./components/GlobalRefineBar";

function WorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") as Id<"projects"> | null;

  // Convex queries & mutations
  const convexProject = useQuery(api.projects.get, projectId ? { id: projectId } : "skip");
  const convexOnboarding = useQuery(
    api.onboarding.get,
    convexProject?.onboardingId ? { id: convexProject.onboardingId } : "skip"
  );
  const convexArtifacts = useQuery(api.artifacts.getByProject, projectId ? { projectId } : "skip");
  const saveArtifactsMut = useMutation(api.artifacts.saveCompleted);
  const updateArtifactMut = useMutation(api.artifacts.updateArtifact);
  const saveArchMut = useMutation(api.artifacts.saveArch);
  const updateProjectMut = useMutation(api.projects.update);
  const saveOnboardingMut = useMutation(api.onboarding.save);

  const [artifacts, setArtifacts] = useState<Artifacts>({});
  const [streamingContent, setStreamingContent] = useState<Partial<Record<ArtifactType, string>>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"business" | "technical" | "architecture">("business");
  const [refinementCount, setRefinementCount] = useState(0);
  const [focusedType, setFocusedType] = useState<ArtifactType | null>(null);
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const [renameTitleValue, setRenameTitleValue] = useState("");
  const [isGlobalRefining, setIsGlobalRefining] = useState(false);

  // Architecture view state
  type ArchPhase = "idle" | "loading" | "graph-ready" | "streaming" | "done" | "error";
  const [archPhase, setArchPhase] = useState<ArchPhase>("idle");
  const [archGraph, setArchGraph] = useState<ArchitectureGraph | null>(null);
  const [archProse, setArchProse] = useState("");
  const [archStatusMessages, setArchStatusMessages] = useState<string[]>([]);
  const archGenerated = useRef(false);
  const activeViewRef = useRef<"business" | "technical" | "architecture">("business");
  const archGraphRef = useRef<ArchitectureGraph | null>(null);
  const archProseRef = useRef("");
  const archStatusRef = useRef<string[]>([]);

  // Refs for accurate accumulation without stale closures
  const streamAccumRef = useRef<Partial<Record<ArtifactType, string>>>({});
  const artifactsRef = useRef<Artifacts>({});
  const hasGenerated = useRef(false);
  const hasLoadedFromDb = useRef(false);

  // Build a project-like object from Convex data
  const project = convexProject ? {
    id: convexProject._id,
    name: convexProject.name,
    idea: convexProject.idea,
    description: convexProject.description,
    questionnaire: convexOnboarding ? {
      userRoles: convexOnboarding.userRoles || undefined,
      accessControl: convexOnboarding.accessControl || undefined,
      keyWorkflows: convexOnboarding.keyWorkflows || undefined,
      approvals: convexOnboarding.approvals || undefined,
      notifications: convexOnboarding.notifications || undefined,
    } : undefined,
    mode: convexProject.mode,
    dashboardStyle: convexProject.dashboardStyle,
    createdAt: convexProject.createdAt,
  } : null;

  const projectRef = useRef(project);
  useEffect(() => { projectRef.current = project; }, [project]);
  useEffect(() => { artifactsRef.current = artifacts; }, [artifacts]);
  useEffect(() => { activeViewRef.current = activeView; }, [activeView]);

  // Redirect if no project ID in URL
  useEffect(() => {
    if (!projectId) router.replace("/");
  }, [projectId, router]);

  // Load artifacts from Convex when available, and auto-generate if empty
  useEffect(() => {
    if (!convexProject || hasLoadedFromDb.current) return;

    setActiveView(convexProject.dashboardStyle);

    if (convexArtifacts && convexArtifacts.status === "completed") {
      const loaded: Artifacts = {};
      const keys: ArtifactType[] = ["vision", "requirements", "architecture", "frameworks", "backlog", "tests", "competitive_analysis", "cost_estimate"];
      for (const key of keys) {
        const val = convexArtifacts[key as keyof typeof convexArtifacts];
        if (typeof val === "string") loaded[key] = val;
      }
      if (Object.keys(loaded).length > 0) {
        setArtifacts(loaded);
        artifactsRef.current = loaded;
        hasLoadedFromDb.current = true;
        // Restore saved architecture if available
        if (convexArtifacts.archGraph) {
          try {
            setArchGraph(JSON.parse(convexArtifacts.archGraph) as ArchitectureGraph);
            setArchPhase("done");
            archGenerated.current = true;
          } catch { /* ignore parse errors */ }
        }
        if (convexArtifacts.archProse) setArchProse(convexArtifacts.archProse);
        if (convexArtifacts.archStatusMessages) setArchStatusMessages(convexArtifacts.archStatusMessages);
        return;
      }
    }

    if (convexArtifacts === undefined) return;

    hasLoadedFromDb.current = true;
    if (!hasGenerated.current) {
      hasGenerated.current = true;
      runGeneration(convexProject.idea, convexProject.mode);
    }
    // If user already navigated to architecture tab before data loaded, start arch generation now
    if (activeViewRef.current === "architecture" && !archGenerated.current) {
      archGenerated.current = true;
      startArchGeneration(convexProject.idea);
    }
  }, [convexProject, convexArtifacts]); // eslint-disable-line react-hooks/exhaustive-deps

  async function runGeneration(idea: string, mode: string) {
    streamAccumRef.current = {};
    setIsGenerating(true);
    setError(null);
    const collected: Artifacts = {};
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, mode }),
      });
      if (!res.ok || !res.body) throw new Error("Generation failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const parsed = JSON.parse(line);
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.chunk !== undefined) {
            const t = parsed.type as ArtifactType;
            streamAccumRef.current[t] = (streamAccumRef.current[t] ?? "") + parsed.chunk;
            setStreamingContent((prev) => ({ ...prev, [t]: streamAccumRef.current[t]! }));
          } else if (parsed.done) {
            const t = parsed.type as ArtifactType;
            const final = streamAccumRef.current[t] ?? "";
            collected[t] = final;
            setArtifacts((prev) => ({ ...prev, [t]: final }));
            setStreamingContent((prev) => { const next = { ...prev }; delete next[t]; return next; });
          }
        }
      }
      artifactsRef.current = collected;
      if (projectId) await saveArtifactsMut({ projectId, ...collected });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsGenerating(false);
    }
  }

  function buildIdea(description: string, q: Project["questionnaire"]) {
    const parts = [description];
    if (q?.userRoles) parts.push(`Users & roles: ${q.userRoles}`);
    if (q?.accessControl) parts.push(`Access control: ${q.accessControl}`);
    if (q?.keyWorkflows) parts.push(`Key workflows: ${q.keyWorkflows}`);
    if (q?.approvals) parts.push(`Approvals: ${q.approvals}`);
    if (q?.notifications) parts.push(`Notifications: ${q.notifications}`);
    return parts.join("\n\n");
  }

  function handleUpdateIdea(newDescription: string) {
    const proj = projectRef.current;
    if (!proj || !projectId) return;
    const newIdea = buildIdea(newDescription, proj.questionnaire);
    updateProjectMut({ id: projectId, description: newDescription, idea: newIdea });
    setArtifacts({});
    artifactsRef.current = {};
    setStreamingContent({});
    streamAccumRef.current = {};
    runGeneration(newIdea, proj.mode);
  }

  function handleUpdateQuestionnaire(field: string, value: string) {
    const proj = projectRef.current;
    if (!proj || !projectId) return;
    const updatedQ = { ...proj.questionnaire, [field]: value };
    const newIdea = buildIdea(proj.description ?? proj.idea.split("\n\n")[0], updatedQ);
    updateProjectMut({ id: projectId, idea: newIdea });
    // Persist questionnaire field to onboarding record if available
    if (convexOnboarding) {
      saveOnboardingMut({
        id: convexOnboarding._id,
        toolDescription: convexOnboarding.toolDescription,
        projectMode: convexOnboarding.projectMode,
        userRoles: updatedQ.userRoles ?? "",
        accessControl: updatedQ.accessControl ?? "",
        keyWorkflows: updatedQ.keyWorkflows ?? "",
        approvals: updatedQ.approvals ?? "",
        notifications: updatedQ.notifications ?? "",
        uploadedFiles: convexOnboarding.uploadedFiles ?? [],
        status: convexOnboarding.status,
      }).catch(() => {});
    }
    setArtifacts({});
    artifactsRef.current = {};
    setStreamingContent({});
    streamAccumRef.current = {};
    runGeneration(newIdea, proj.mode);
  }

  const handleStartRefinement = useCallback(async (type: ArtifactType, refinementText: string) => {
    const proj = projectRef.current;
    if (!proj) throw new Error("No project loaded");

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refinement: refinementText,
        targetArtifact: type,
        currentArtifacts: artifactsRef.current,
        mode: proj.mode,
      }),
    });
    if (!res.ok || !res.body) throw new Error("Feedback request failed");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    const refinementAccum: Partial<Record<ArtifactType, string>> = {};

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.trim()) continue;
        const parsed = JSON.parse(line);

        if (parsed.event === "error") throw new Error(parsed.message);

        if (parsed.event === "impact") {
          const affected = parsed.affectedArtifacts as ArtifactType[];
          setStreamingContent((prev) => {
            const next = { ...prev };
            for (const t of affected) { next[t] = artifactsRef.current[t] ?? ""; }
            return next;
          });
        }

        if (parsed.event === "chunk") {
          const t = parsed.artifactType as ArtifactType;
          refinementAccum[t] = (refinementAccum[t] ?? "") + parsed.chunk;
          setStreamingContent((prev) => ({ ...prev, [t]: refinementAccum[t]! }));
        }

        if (parsed.event === "artifact_done") {
          const t = parsed.artifactType as ArtifactType;
          const final = parsed.content as string;
          setArtifacts((prev) => {
            const merged = { ...prev, [t]: final };
            artifactsRef.current = merged;
            return merged;
          });
          setStreamingContent((prev) => { const next = { ...prev }; delete next[t]; return next; });
          if (projectId) updateArtifactMut({ projectId, key: t, value: final });
        }

        if (parsed.event === "complete") setRefinementCount((c) => c + 1);
      }
    }
  }, [projectId, updateArtifactMut]);

  const handleDirectSave = useCallback((type: ArtifactType, text: string) => {
    setArtifacts((prev) => {
      const merged = { ...prev, [type]: text };
      artifactsRef.current = merged;
      return merged;
    });
    if (projectId) updateArtifactMut({ projectId, key: type, value: text });
  }, [projectId, updateArtifactMut]);

  function parseSSEBuffer(buffer: string) {
    const parsed: Array<{ type: string; data: Record<string, unknown> }> = [];
    const events = buffer.split("\n\n");
    const remainder = events.pop() ?? "";
    for (const raw of events) {
      if (!raw.trim()) continue;
      const lines = raw.split("\n");
      let type = "", dataStr = "";
      for (const line of lines) {
        if (line.startsWith("event: ")) type = line.slice(7).trim();
        if (line.startsWith("data: ")) dataStr = line.slice(6).trim();
      }
      if (type && dataStr) { try { parsed.push({ type, data: JSON.parse(dataStr) }); } catch { /* skip */ } }
    }
    return { parsed, remainder };
  }

  const startArchGeneration = useCallback(async (specs: string) => {
    setArchPhase("loading");
    setArchStatusMessages([]);
    setArchGraph(null);
    setArchProse("");
    try {
      const res = await fetch("/api/generate-architecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessSpecs: specs }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const { parsed, remainder } = parseSSEBuffer(buffer);
        buffer = remainder;
        for (const event of parsed) {
          if (event.type === "status") {
            const msg = event.data.message as string;
            archStatusRef.current = [...archStatusRef.current, msg];
            setArchStatusMessages((prev) => [...prev, msg]);
          }
          if (event.type === "architecture") {
            const g = event.data as unknown as ArchitectureGraph;
            archGraphRef.current = g;
            setArchGraph(g);
            setArchPhase("graph-ready");
          }
          if (event.type === "prose") {
            archProseRef.current += event.data.chunk as string;
            setArchPhase("streaming");
            setArchProse((prev) => prev + (event.data.chunk as string));
          }
          if (event.type === "done") setArchPhase("done");
          if (event.type === "error") setArchPhase("error");
        }
      }
    } catch { setArchPhase("error"); return; }
    // Save arch to DB after full generation
    if (projectId && archGraphRef.current) {
      saveArchMut({
        projectId,
        archGraph: JSON.stringify(archGraphRef.current),
        archProse: archProseRef.current,
        archStatusMessages: archStatusRef.current,
      }).catch(() => {});
    }
  }, [projectId, saveArchMut]);

  async function handleGlobalRefine(refinement: string) {
    setIsGlobalRefining(true);
    try {
      await handleStartRefinement("requirements", refinement);
    } finally {
      setIsGlobalRefining(false);
    }
  }

  function handleViewChange(v: "business" | "technical" | "architecture") {
    setActiveView(v);
    // Only generate if DB load is complete (prevents racing with saved arch restore)
    if (v === "architecture" && !archGenerated.current && hasLoadedFromDb.current && projectRef.current) {
      archGenerated.current = true;
      startArchGeneration(projectRef.current.idea);
    }
  }

  const artifactTypes = activeView === "business" ? BUSINESS_ARTIFACTS : TECH_ARTIFACTS;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-50 shrink-0 border-b border-border bg-nav-bg">
        <div className="flex items-center h-14 px-4 sm:px-6 justify-between">
          <div className="flex items-center gap-3">
            <MaturaLogo className="h-7" />
            {project && (
              <>
                <div className="hidden sm:block h-5 w-px bg-border" />
                <div className="hidden sm:block">
                  {isRenamingTitle ? (
                    <input
                      autoFocus
                      className="text-sm font-medium text-foreground leading-tight bg-transparent border-b border-primary outline-none w-48"
                      value={renameTitleValue}
                      onChange={(e) => setRenameTitleValue(e.target.value)}
                      onBlur={async () => {
                        const trimmed = renameTitleValue.trim();
                        if (trimmed && trimmed !== project.name && projectId) {
                          await updateProjectMut({ id: projectId, name: trimmed });
                        }
                        setIsRenamingTitle(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                        if (e.key === "Escape") setIsRenamingTitle(false);
                      }}
                    />
                  ) : (
                    <button
                      className="group flex items-center gap-1 text-sm font-medium text-foreground leading-tight hover:text-foreground"
                      onClick={() => { setRenameTitleValue(project.name); setIsRenamingTitle(true); }}
                    >
                      {project.name}
                      <span className="opacity-0 group-hover:opacity-50 text-foreground-muted transition-opacity">✎</span>
                    </button>
                  )}
                  <p className="text-xs text-foreground-muted leading-tight flex items-center gap-1.5">
                    {project.mode === "external" ? "External" : "Internal"} mode
                    {isGenerating && (
                      <>
                        <span className="text-foreground-muted">·</span>
                        <span className="text-primary flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          Generating…
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle pills */}
            <div className="flex items-center rounded-full border border-border bg-background p-0.5">
              {(["business", "technical", "architecture"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => handleViewChange(v)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                    activeView === v
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  {v === "business" ? "Business" : v === "technical" ? "Technical" : "Architecture"}
                </button>
              ))}
            </div>
            {refinementCount > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-success bg-success/10 border border-success/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                {refinementCount} refinement{refinementCount !== 1 ? "s" : ""} applied
              </span>
            )}
            <button
              onClick={() => router.push("/home")}
              className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-foreground-secondary hover:text-foreground hover:border-foreground-muted transition-colors"
            >
              Home
            </button>
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
      </header>

      {/* Body: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-80 shrink-0 border-r border-border bg-card-bg flex flex-col overflow-y-auto">
          <div className="m-3 rounded-xl bg-primary p-4 shrink-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-foreground/70 mb-1">
              Project Workspace
            </p>
            <p className="text-sm font-bold text-primary-foreground leading-snug line-clamp-2">
              {project?.name ?? "Loading…"}
            </p>
            <span className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded font-medium bg-primary-foreground/20 text-primary-foreground">
              {project?.mode === "external" ? "External" : "Internal"} mode
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-4">
            {project && (
              <>
                <IdeaPanel project={project} onUpdateIdea={handleUpdateIdea} onUpdateQuestionnaire={handleUpdateQuestionnaire} />
                <SidebarViewSwitch active={activeView} onChange={handleViewChange} />
              </>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {error && (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-center px-6">
              <p className="text-sm text-error">Generation failed</p>
              <p className="text-xs text-foreground-muted">
                {error.includes("rate_limit")
                  ? "API rate limit reached — please wait a moment and try again."
                  : error.includes("API key") || error.includes("auth")
                    ? "Invalid API key. Check ANTHROPIC_API_KEY in .env.local."
                    : "Something went wrong. Please try again."}
              </p>
              <button onClick={() => router.push("/home")} className="text-xs text-primary underline">
                Back to home
              </button>
            </div>
          )}

          {!error && project && (
            <div key={activeView} className="animate-view-switch">
              {/* Architecture view */}
              {activeView === "architecture" && (
                <div className="flex h-[calc(100vh-8rem)] rounded-xl overflow-hidden border border-border">
                  <div className="flex-[3] min-w-0 border-r border-border">
                    <ArchGraph graph={archGraph} />
                  </div>
                  <div className="flex-[2] overflow-y-auto p-5 bg-card-bg space-y-5">
                    {archGraph && <TechStackLegend graph={archGraph} />}
                    <ProsePanel
                      statusMessages={archStatusMessages}
                      prose={archProse}
                      isStreaming={archPhase === "streaming"}
                    />
                  </div>
                </div>
              )}

              {/* Artifacts grid (business / technical) */}
              {activeView !== "architecture" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {artifactTypes.map((type, i) => (
                    <ArtifactCard
                      key={type}
                      type={type}
                      index={i}
                      content={artifacts[type]}
                      streamingText={streamingContent[type]}
                      onStartRefinement={handleStartRefinement}
                      onDirectSave={handleDirectSave}
                      onFocus={() => setFocusedType(type)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <GlobalRefineBar
        isRefining={isGlobalRefining}
        disabled={isGenerating || Object.keys(artifacts).length === 0}
        onSubmit={handleGlobalRefine}
      />

      {/* Focus modal */}
      {focusedType && (
        <ArtifactModal
          type={focusedType}
          content={artifacts[focusedType]}
          streamingText={streamingContent[focusedType]}
          onStartRefinement={handleStartRefinement}
          onDirectSave={handleDirectSave}
          onClose={() => setFocusedType(null)}
        />
      )}
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="h-screen bg-background" />}>
      <WorkspaceContent />
    </Suspense>
  );
}
