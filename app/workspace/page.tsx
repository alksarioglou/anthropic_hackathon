"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { UserButton } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import { MaturaLogo } from "@/components/MaturaLogo";
import type { Project, Artifacts, ArtifactType } from "@/types";
import { ARTIFACT_LABELS, BUSINESS_ARTIFACTS, TECH_ARTIFACTS } from "@/types";
import { ArchGraph } from "@/components/ArchGraph";
import { ProsePanel } from "@/components/ProsePanel";
import { TechStackLegend } from "@/components/TechStackLegend";
import type { ArchitectureGraph } from "@/types/architecture";

// ─── icons ───────────────────────────────────────────────────────────────────

function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}

function CollapseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

// ─── artifact card ───────────────────────────────────────────────────────────

function ArtifactCard({
  type,
  content,
  streamingText,
  onStartRefinement,
  onDirectSave,
  onFocus,
  index = 0,
}: {
  type: ArtifactType;
  content: string | undefined;
  streamingText: string | undefined;
  onStartRefinement: (type: ArtifactType, refinement: string) => Promise<void>;
  onDirectSave: (type: ArtifactType, text: string) => void;
  onFocus?: () => void;
  index?: number;
}) {
  const isDone = content !== undefined;
  const isStreaming = streamingText !== undefined;
  const displayText = streamingText ?? content ?? "";

  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [showRefine, setShowRefine] = useState(false);
  const [refinement, setRefinement] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const refineRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isStreaming && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamingText, isStreaming]);

  useEffect(() => {
    if (showRefine) refineRef.current?.focus();
  }, [showRefine]);

  async function submitRefinement() {
    if (!refinement.trim() || isRefining) return;
    setIsRefining(true);
    setRefineError(null);
    try {
      await onStartRefinement(type, refinement.trim());
      setRefinement("");
      setShowRefine(false);
    } catch (err) {
      setRefineError(err instanceof Error ? err.message : "Failed");
    } finally {
      setIsRefining(false);
    }
  }

  function handleRefineKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submitRefinement();
    }
  }

  const borderColor = editMode
    ? "border-amber-500/50"
    : showRefine
      ? "border-primary/50"
      : "border-border";

  return (
    <div
      className={`group relative rounded-xl border bg-card-bg transition-colors animate-card-in ${borderColor}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Card header */}
      <div className="px-4 py-3 flex items-center justify-between gap-2 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-foreground truncate">
            {ARTIFACT_LABELS[type]}
          </span>
          {isStreaming && (
            <span className="flex-shrink-0 flex items-center gap-1.5 text-xs text-primary animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              AI is writing…
            </span>
          )}
        </div>

        {isDone && !editMode && !isStreaming && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => { setEditText(content!); setEditMode(true); setShowRefine(false); }}
              className="text-xs text-foreground-muted hover:text-foreground border border-border hover:border-foreground-muted px-2 py-0.5 rounded-md transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-foreground-muted hover:text-foreground border border-border px-2 py-0.5 rounded-md transition-colors"
            >
              {expanded ? "↑" : "↓"}
            </button>
            {onFocus && (
              <button
                onClick={onFocus}
                title="Open full view"
                className="flex items-center gap-1 text-xs text-foreground-secondary hover:text-foreground border border-border hover:border-foreground-muted px-2 py-0.5 rounded-md transition-colors"
              >
                <ExpandIcon className="w-3 h-3" />
                <span>Focus</span>
              </button>
            )}
          </div>
        )}

        {editMode && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setEditMode(false)}
              className="text-xs text-foreground-muted hover:text-foreground px-2 py-0.5 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { onDirectSave(type, editText); setEditMode(false); }}
              className="text-xs font-medium text-amber-600 border border-amber-500/40 bg-amber-500/10 hover:border-amber-500/70 px-2 py-0.5 rounded-md transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Waiting skeleton */}
      {!displayText && (
        <div className="px-4 py-5">
          <div className="space-y-2">
            {[100, 88, 72, 52].map((w, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full bg-background-tertiary animate-pulse"
                style={{ width: `${w}%`, animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Read / streaming view */}
      {!editMode && displayText && (
        <>
          <div className="relative">
            {(isDone || isStreaming) && !editMode && !isRefining && (
              <button
                onClick={() => { setShowRefine((v) => !v); setRefineError(null); }}
                title="Refine with AI"
                className={`
                  absolute top-2 right-2 z-10
                  w-7 h-7 rounded-full border flex items-center justify-center
                  shadow-sm transition-all duration-150
                  ${showRefine
                    ? "opacity-100 scale-100 border-primary bg-primary text-primary-foreground"
                    : "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 border-border bg-card-bg text-foreground-muted hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  }
                `}
              >
                <SparklesIcon className="w-3.5 h-3.5" />
              </button>
            )}

            <div
              ref={contentRef}
              className={`px-4 py-3 overflow-y-auto transition-all ${expanded ? "max-h-[32rem]" : "max-h-44"}`}
            >
              {isStreaming ? (
                <pre className="text-xs text-foreground-secondary whitespace-pre-wrap font-mono leading-relaxed">
                  {displayText}
                  <span className="inline-block w-0.5 h-3 bg-primary animate-pulse align-middle ml-0.5" />
                </pre>
              ) : (
                <div className="md-content">
                  <ReactMarkdown>{displayText}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          {!expanded && isDone && !isStreaming && displayText.length > 500 && (
            <div className="px-4 pb-2">
              <button
                onClick={() => setExpanded(true)}
                className="text-xs text-foreground-muted hover:text-foreground underline underline-offset-2"
              >
                Show more
              </button>
            </div>
          )}
        </>
      )}

      {/* Direct edit textarea */}
      {editMode && (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="w-full px-4 py-3 bg-background text-xs text-foreground font-mono leading-relaxed resize-none focus:outline-none rounded-b-xl"
          rows={14}
        />
      )}

      {/* Inline AI refinement form */}
      {(isDone || isStreaming) && showRefine && (
        <div className="px-4 py-3 border-t border-border bg-background space-y-2 rounded-b-xl">
          <textarea
            ref={refineRef}
            value={refinement}
            onChange={(e) => setRefinement(e.target.value)}
            onKeyDown={handleRefineKeyDown}
            placeholder={`What would you like to change? (⌘↵ to apply)`}
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-card-bg border border-input-border text-foreground text-xs placeholder:text-foreground-muted focus:outline-none focus:border-input-border-focus resize-none"
          />
          {refineError && <p className="text-xs text-error">{refineError}</p>}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-foreground-muted">Propagates to related artifacts automatically.</p>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowRefine(false); setRefinement(""); setRefineError(null); }}
                className="text-xs text-foreground-muted hover:text-foreground px-3 py-1.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitRefinement}
                disabled={isRefining || !refinement.trim()}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-background-tertiary disabled:text-foreground-muted text-primary-foreground transition-colors"
              >
                {isRefining ? "Applying…" : "Apply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── focus modal ─────────────────────────────────────────────────────────────

function ArtifactModal({
  type,
  content,
  streamingText,
  onStartRefinement,
  onDirectSave,
  onClose,
}: {
  type: ArtifactType;
  content: string | undefined;
  streamingText: string | undefined;
  onStartRefinement: (type: ArtifactType, refinement: string) => Promise<void>;
  onDirectSave: (type: ArtifactType, text: string) => void;
  onClose: () => void;
}) {
  const isStreaming = streamingText !== undefined;
  const displayText = streamingText ?? content ?? "";

  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [showRefine, setShowRefine] = useState(false);
  const [refinement, setRefinement] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);

  const refineRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (showRefine) refineRef.current?.focus();
  }, [showRefine]);

  async function submitRefinement() {
    if (!refinement.trim() || isRefining) return;
    setIsRefining(true);
    setRefineError(null);
    try {
      await onStartRefinement(type, refinement.trim());
      setRefinement("");
      setShowRefine(false);
    } catch (err) {
      setRefineError(err instanceof Error ? err.message : "Failed");
    } finally {
      setIsRefining(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border bg-background shadow-2xl overflow-hidden transition-colors animate-modal-in ${editMode ? "border-amber-500/50" : showRefine ? "border-primary/50" : "border-border"}`}>

        {/* Modal header */}
        <div className="px-5 py-3.5 flex items-center justify-between gap-2 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{ARTIFACT_LABELS[type]}</span>
            {isStreaming && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
          </div>
          <div className="flex items-center gap-1.5">
            {!editMode && !isStreaming && content !== undefined && (
              <>
                <button
                  onClick={() => { setShowRefine((v) => !v); setRefineError(null); }}
                  title="Refine with AI"
                  className={`p-1.5 rounded-lg border transition-colors ${showRefine ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground-muted hover:border-primary hover:bg-primary hover:text-primary-foreground"}`}
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { setEditText(content!); setEditMode(true); setShowRefine(false); }}
                  className="text-xs text-foreground-muted hover:text-foreground border border-border hover:border-foreground-muted px-2 py-1 rounded-lg transition-colors"
                >
                  Edit
                </button>
              </>
            )}
            {editMode && (
              <>
                <button onClick={() => setEditMode(false)} className="text-xs text-foreground-muted hover:text-foreground px-2 py-1 rounded-lg transition-colors">Cancel</button>
                <button
                  onClick={() => { onDirectSave(type, editText); setEditMode(false); }}
                  className="text-xs font-medium text-amber-600 border border-amber-500/40 bg-amber-500/10 hover:border-amber-500/70 px-2 py-1 rounded-lg transition-colors"
                >
                  Save
                </button>
              </>
            )}
            <button onClick={onClose} title="Close (Esc)" className="ml-1 p-1.5 rounded-lg border border-border text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-colors">
              <CollapseIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal content */}
        <div className="flex-1 overflow-y-auto">
          {editMode ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full h-full min-h-[60vh] px-5 py-4 bg-background-secondary text-sm text-foreground font-mono leading-relaxed resize-none focus:outline-none"
            />
          ) : (
            <div className="px-5 py-4">
              {isStreaming ? (
                <pre className="text-sm text-foreground-secondary whitespace-pre-wrap font-mono leading-relaxed">
                  {displayText}
                  <span className="inline-block w-0.5 h-4 bg-primary animate-pulse align-middle ml-0.5" />
                </pre>
              ) : (
                <div className="md-content !text-sm">
                  <ReactMarkdown>{displayText}</ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Refinement form */}
        {!editMode && showRefine && (
          <div className="px-5 py-3.5 border-t border-border bg-card-bg space-y-2 flex-shrink-0 animate-refine-in">
            <textarea
              ref={refineRef}
              value={refinement}
              onChange={(e) => setRefinement(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submitRefinement(); } }}
              placeholder="What would you like to change? (⌘↵ to apply)"
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-background border border-input-border text-foreground text-xs placeholder:text-foreground-muted focus:outline-none focus:border-input-border-focus resize-none"
            />
            {refineError && <p className="text-xs text-error">{refineError}</p>}
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-foreground-muted">Propagates to related artifacts automatically.</p>
              <div className="flex gap-2">
                <button onClick={() => { setShowRefine(false); setRefinement(""); setRefineError(null); }} className="text-xs text-foreground-muted hover:text-foreground px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                <button
                  onClick={submitRefinement}
                  disabled={isRefining || !refinement.trim()}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-background-tertiary disabled:text-foreground-muted text-primary-foreground transition-colors"
                >
                  {isRefining ? "Applying…" : "Apply"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── idea panel ──────────────────────────────────────────────────────────────

function QuestionRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-foreground-muted mb-0.5">{label}</p>
      <p className="text-xs text-foreground-secondary whitespace-pre-line leading-relaxed">{value}</p>
    </div>
  );
}

function IdeaPanel({ project, onUpdateIdea }: { project: Project; onUpdateIdea: (desc: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [showRefine, setShowRefine] = useState(false);
  const [refinement, setRefinement] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const refineRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (showRefine) refineRef.current?.focus(); }, [showRefine]);

  const description = project.description ?? project.idea.split("\n\n")[0];
  const q = project.questionnaire;

  async function applyRefinement() {
    if (!refinement.trim() || isRefining) return;
    setIsRefining(true);
    setShowRefine(false);
    const instruction = refinement.trim();
    setRefinement("");
    try {
      const res = await fetch("/api/field-refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentValue: description, refinement: instruction }),
      });
      if (!res.ok || !res.body) throw new Error("Failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const parsed = JSON.parse(line);
          if (parsed.chunk !== undefined) accumulated += parsed.chunk;
        }
      }
      onUpdateIdea(accumulated);
    } catch { /* silent */ } finally {
      setIsRefining(false);
    }
  }

  return (
    <div className={`rounded-xl bg-background border animate-fade-in overflow-hidden transition-colors ${editMode ? "border-amber-500/50" : showRefine ? "border-primary/50" : "border-border"}`}>
      {/* Collapsible header */}
      <div
        className="px-4 py-2.5 flex items-center justify-between cursor-pointer select-none"
        onClick={() => { if (!editMode && !showRefine) setExpanded((v) => !v); }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <svg
            className={`w-3.5 h-3.5 text-foreground-muted transition-transform duration-200 shrink-0 ${expanded ? "rotate-90" : ""}`}
            viewBox="0 0 16 16" fill="currentColor"
          >
            <path d="M6 3l5 5-5 5V3z" />
          </svg>
          <p className="text-xs font-medium text-foreground-muted">Project idea</p>
          {!expanded && (
            <p className="text-xs text-foreground-secondary truncate ml-1 max-w-[160px]">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {!editMode && !isRefining && (
            <>
              <button
                onClick={() => { setShowRefine((v) => !v); setExpanded(true); }}
                title="Refine with AI"
                className={`p-1.5 rounded-lg border transition-colors ${showRefine ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground-muted hover:border-primary hover:bg-primary hover:text-primary-foreground"}`}
              >
                <SparklesIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setEditText(description); setEditMode(true); setShowRefine(false); setExpanded(true); }}
                className="text-xs text-foreground-muted hover:text-foreground border border-border hover:border-foreground-muted px-2 py-0.5 rounded-md transition-colors"
              >
                Edit
              </button>
            </>
          )}
          {editMode && (
            <>
              <button onClick={() => setEditMode(false)} className="text-xs text-foreground-muted hover:text-foreground px-2 py-0.5 rounded-md transition-colors">Cancel</button>
              <button
                onClick={() => { onUpdateIdea(editText); setEditMode(false); }}
                className="text-xs font-medium text-amber-600 border border-amber-500/40 bg-amber-500/10 hover:border-amber-500/70 px-2 py-0.5 rounded-md transition-colors"
              >
                Save & Regenerate
              </button>
            </>
          )}
          {isRefining && (
            <span className="text-xs text-primary flex items-center gap-1.5 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Refining…
            </span>
          )}
        </div>
      </div>

      {/* Collapsible body */}
      {(expanded || editMode || showRefine) && (
        <>
          <div className="border-t border-border" />

          {editMode ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={4}
              autoFocus
              className="w-full px-4 py-3 bg-background-secondary text-sm text-foreground font-mono leading-relaxed resize-none focus:outline-none"
            />
          ) : (
            <div className="px-4 py-3">
              <p className="text-sm text-foreground-secondary whitespace-pre-line max-h-32 overflow-y-auto leading-relaxed">{description}</p>
            </div>
          )}

          {!editMode && q && (q.userRoles || q.accessControl || q.keyWorkflows || q.approvals || q.notifications) && (
            <div className="px-4 pb-3 pt-3 border-t border-border-light space-y-2">
              {q.userRoles && <QuestionRow label="Users & Roles" value={q.userRoles} />}
              {q.accessControl && <QuestionRow label="Access Control" value={q.accessControl} />}
              {q.keyWorkflows && <QuestionRow label="Key Workflows" value={q.keyWorkflows} />}
              {q.approvals && <QuestionRow label="Approvals" value={q.approvals} />}
              {q.notifications && <QuestionRow label="Notifications" value={q.notifications} />}
            </div>
          )}

          {showRefine && (
            <div className="px-4 py-3 border-t border-border bg-card-bg space-y-2">
              <textarea
                ref={refineRef}
                value={refinement}
                onChange={(e) => setRefinement(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); applyRefinement(); } }}
                placeholder="How should the idea be refined? (⌘↵ to apply)"
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-background border border-input-border text-foreground text-xs placeholder:text-foreground-muted focus:outline-none focus:border-primary resize-none"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => { setShowRefine(false); setRefinement(""); }} className="text-xs text-foreground-muted hover:text-foreground px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                <button
                  onClick={applyRefinement}
                  disabled={!refinement.trim()}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-background-tertiary disabled:text-foreground-muted text-primary-foreground transition-colors"
                >
                  Refine & Regenerate
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── view toggle ─────────────────────────────────────────────────────────────

function ViewToggle({
  active,
  onChange,
}: {
  active: "business" | "technical" | "architecture";
  onChange: (v: "business" | "technical" | "architecture") => void;
}) {
  const labels: Record<string, string> = { business: "Business Mode", technical: "Dev Mode", architecture: "Architecture" };
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-foreground-muted mb-1">View</p>
      {(["business", "technical", "architecture"] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
            active === v
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
          }`}
        >
          {labels[v]}
        </button>
      ))}
    </div>
  );
}

// ─── main workspace content ───────────────────────────────────────────────────

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
  const updateProjectMut = useMutation(api.projects.update);

  const [artifacts, setArtifacts] = useState<Artifacts>({});
  const [streamingContent, setStreamingContent] = useState<Partial<Record<ArtifactType, string>>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"business" | "technical" | "architecture">("technical");
  const [refinementCount, setRefinementCount] = useState(0);
  const [focusedType, setFocusedType] = useState<ArtifactType | null>(null);

  // Architecture view state
  type ArchPhase = "idle" | "loading" | "graph-ready" | "streaming" | "done" | "error";
  const [archPhase, setArchPhase] = useState<ArchPhase>("idle");
  const [archGraph, setArchGraph] = useState<ArchitectureGraph | null>(null);
  const [archProse, setArchProse] = useState("");
  const [archStatusMessages, setArchStatusMessages] = useState<string[]>([]);
  const archGenerated = useRef(false);

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

  // Redirect if no project ID in URL
  useEffect(() => {
    if (!projectId) {
      router.replace("/");
    }
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
        if (typeof val === "string") {
          loaded[key] = val;
        }
      }
      if (Object.keys(loaded).length > 0) {
        setArtifacts(loaded);
        artifactsRef.current = loaded;
        hasLoadedFromDb.current = true;
        return;
      }
    }

    if (convexArtifacts === undefined) return;

    hasLoadedFromDb.current = true;
    if (!hasGenerated.current) {
      hasGenerated.current = true;
      runGeneration(convexProject.idea, convexProject.mode);
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
      if (projectId) {
        await saveArtifactsMut({ projectId, ...collected });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleUpdateIdea(newDescription: string) {
    const proj = projectRef.current;
    if (!proj || !projectId) return;
    const q = proj.questionnaire;
    const ideaParts = [newDescription];
    if (q?.userRoles) ideaParts.push(`Users & roles: ${q.userRoles}`);
    if (q?.accessControl) ideaParts.push(`Access control: ${q.accessControl}`);
    if (q?.keyWorkflows) ideaParts.push(`Key workflows: ${q.keyWorkflows}`);
    if (q?.approvals) ideaParts.push(`Approvals: ${q.approvals}`);
    if (q?.notifications) ideaParts.push(`Notifications: ${q.notifications}`);
    const newIdea = ideaParts.join("\n\n");
    updateProjectMut({ id: projectId, description: newDescription, idea: newIdea });
    setArtifacts({});
    artifactsRef.current = {};
    setStreamingContent({});
    streamAccumRef.current = {};
    runGeneration(newIdea, proj.mode);
  }

  // Streaming refinement — handles NDJSON from /api/feedback
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
          if (projectId) { updateArtifactMut({ projectId, key: t, value: final }); }
        }

        if (parsed.event === "complete") { setRefinementCount((c) => c + 1); }
      }
    }
  }, [projectId, updateArtifactMut]);

  const handleDirectSave = useCallback((type: ArtifactType, text: string) => {
    setArtifacts((prev) => {
      const merged = { ...prev, [type]: text };
      artifactsRef.current = merged;
      return merged;
    });
    if (projectId) { updateArtifactMut({ projectId, key: type, value: text }); }
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
          if (event.type === "status") setArchStatusMessages((prev) => [...prev, event.data.message as string]);
          if (event.type === "architecture") { setArchGraph(event.data as unknown as ArchitectureGraph); setArchPhase("graph-ready"); }
          if (event.type === "prose") { setArchPhase("streaming"); setArchProse((prev) => prev + (event.data.chunk as string)); }
          if (event.type === "done") setArchPhase("done");
          if (event.type === "error") setArchPhase("error");
        }
      }
    } catch { setArchPhase("error"); }
  }, []);

  function handleViewChange(v: "business" | "technical" | "architecture") {
    setActiveView(v);
    if (v === "architecture" && !archGenerated.current && projectRef.current) {
      archGenerated.current = true;
      startArchGeneration(projectRef.current.idea);
    }
  }

  const artifactTypes = activeView === "business" ? BUSINESS_ARTIFACTS : TECH_ARTIFACTS;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header — consistent with OnboardingNav */}
      <header className="sticky top-0 z-50 shrink-0 border-b border-border bg-nav-bg">
        <div className="flex items-center h-14 px-4 sm:px-6 justify-between">
          <div className="flex items-center gap-3">
            <MaturaLogo className="h-7" />
            {project && (
              <>
                <div className="hidden sm:block h-5 w-px bg-border" />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {project.name}
                  </p>
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
            <UserButton />
          </div>
        </div>
      </header>

      {/* Body: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-72 shrink-0 flex flex-col border-r border-border overflow-y-auto">
          {/* Branded project header */}
          <div className="bg-primary px-4 py-4 shrink-0">
            <p className="text-[11px] font-medium text-white/70 uppercase tracking-wide mb-1">Project workspace</p>
            <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
              {project?.name ?? "Loading…"}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-white/80 bg-white/15 px-2 py-0.5 rounded-full">
              {project?.mode === "external" ? "External" : "Internal"} mode
            </span>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 p-4 flex flex-col gap-4 bg-background-secondary">
            {project && (
              <>
                <IdeaPanel project={project} onUpdateIdea={handleUpdateIdea} />
                <ViewToggle active={activeView} onChange={handleViewChange} />
              </>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-background">
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

          {!error && (
            <div className="p-6">
              {/* Architecture view */}
              {activeView === "architecture" && (
                <div className="flex gap-6 h-[calc(100vh-10rem)] rounded-xl overflow-hidden border border-border">
                  <div className="flex-[3] min-w-0">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
