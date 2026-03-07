"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import type { ArtifactType } from "@/types";
import { ARTIFACT_LABELS } from "@/types";
import { ExpandIcon, SparklesIcon } from "./icons";

export function ArtifactCard({
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
              Claude is writing…
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
