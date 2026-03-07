"use client";

import { useState, useRef, useEffect } from "react";
import type { Project } from "@/types";
import { SparklesIcon } from "./icons";

function SidebarQuestionRow({ label, value }: { label: string; value: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border-light last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-background-secondary transition-colors"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <svg
            className={`w-3 h-3 text-foreground-muted shrink-0 transition-transform duration-150 ${open ? "rotate-90" : ""}`}
            viewBox="0 0 16 16" fill="currentColor"
          >
            <path d="M6 3l5 5-5 5V3z" />
          </svg>
          <span className="text-xs font-medium text-foreground-secondary truncate">{label}</span>
        </div>
      </button>
      {open && (
        <div className="px-3 pb-2 pl-7">
          <p className="text-xs text-foreground-muted whitespace-pre-line leading-relaxed">{value}</p>
        </div>
      )}
    </div>
  );
}

export function IdeaPanel({ project, onUpdateIdea }: { project: Project; onUpdateIdea: (desc: string) => void }) {
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
              className="w-full px-3 py-2 bg-background-secondary text-xs text-foreground font-mono leading-relaxed resize-none focus:outline-none"
            />
          ) : (
            <div className="px-3 py-2">
              <p className="text-xs text-foreground-secondary whitespace-pre-line max-h-24 overflow-y-auto leading-relaxed">{description}</p>
            </div>
          )}

          {showRefine && (
            <div className="px-3 py-2 border-t border-border bg-card-bg space-y-2">
              <textarea
                ref={refineRef}
                value={refinement}
                onChange={(e) => setRefinement(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); applyRefinement(); } }}
                placeholder="How should the idea be refined? (⌘↵ to apply)"
                rows={2}
                className="w-full px-2 py-1.5 rounded-lg bg-background border border-input-border text-foreground text-xs placeholder:text-foreground-muted focus:outline-none focus:border-primary resize-none"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => { setShowRefine(false); setRefinement(""); }} className="text-xs text-foreground-muted hover:text-foreground px-2 py-1 rounded-lg transition-colors">Cancel</button>
                <button
                  onClick={applyRefinement}
                  disabled={!refinement.trim()}
                  className="text-xs font-semibold px-2 py-1 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-background-tertiary disabled:text-foreground-muted text-primary-foreground transition-colors"
                >
                  Refine & Regenerate
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Questionnaire rows */}
      {q && (q.userRoles || q.accessControl || q.keyWorkflows || q.approvals || q.notifications) && (
        <div className="border-t border-border">
          {([
            ["Users & Roles", q.userRoles],
            ["Access Control", q.accessControl],
            ["Key Workflows", q.keyWorkflows],
            ["Approvals", q.approvals],
            ["Notifications", q.notifications],
          ] as const).map(([label, value]) =>
            value ? <SidebarQuestionRow key={label} label={label} value={value} /> : null
          )}
        </div>
      )}
    </div>
  );
}
