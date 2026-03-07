"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import type { ArtifactType } from "@/types";
import { ARTIFACT_LABELS } from "@/types";
import { CollapseIcon, SparklesIcon } from "./icons";

export function ArtifactModal({
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
