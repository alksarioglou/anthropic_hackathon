"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

interface StreamingFieldProps {
  label: string;
  value: string;
  streamingText: string | undefined;
  onChange: (v: string) => void;
  placeholder: string;
  rows: number;
}

function toMd(text: string) {
  // Normalize unicode bullets → markdown list syntax so ReactMarkdown renders <ul>
  return text.replace(/^[•·‣▸] /gm, "- ");
}

export function StreamingField({ label, value, streamingText, onChange, placeholder, rows }: StreamingFieldProps) {
  const isStreaming = streamingText !== undefined;
  const hasContent = value.trim().length > 0;

  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [showRefine, setShowRefine] = useState(false);
  const [refinement, setRefinement] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const refineRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (showRefine) refineRef.current?.focus();
  }, [showRefine]);

  function startEdit() {
    setEditText(value);
    setEditMode(true);
    setShowRefine(false);
  }

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
        body: JSON.stringify({ currentValue: value, refinement: instruction }),
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
          if (parsed.chunk !== undefined) { accumulated += parsed.chunk; onChange(accumulated); }
        }
      }
    } catch { /* silent */ } finally {
      setIsRefining(false);
    }
  }

  const borderColor = editMode
    ? "border-amber-400/50"
    : showRefine
      ? "border-accent/50"
      : "border-input-border";

  return (
    <div className={`group rounded-lg border bg-input-bg transition-colors ${borderColor}`}>

      {/* Header row — matches workspace card header */}
      <div className="px-3 py-2 flex items-center justify-between gap-2 border-b border-input-border">
        <div className="flex items-center gap-2 min-w-0">
          <label className="text-sm font-medium text-foreground truncate">{label}</label>
          {isStreaming && (
            <span className="flex-shrink-0 flex items-center gap-1 text-xs text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              AI is writing…
            </span>
          )}
          {isRefining && (
            <span className="flex-shrink-0 flex items-center gap-1 text-xs text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Refining…
            </span>
          )}
        </div>

        {/* Action buttons — visible when content exists and not editing/refining */}
        {hasContent && !editMode && !isStreaming && !isRefining && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => { setShowRefine((v) => !v); }}
              title="Refine with AI"
              className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors
                ${showRefine
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-foreground-muted hover:border-accent hover:text-accent"
                }`}
            >
              <SparklesIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={startEdit}
              className="text-xs text-foreground-muted hover:text-foreground border border-border hover:border-input-border-focus px-2 py-0.5 rounded-md transition-colors"
            >
              Edit
            </button>
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
              onClick={() => { onChange(editText); setEditMode(false); }}
              className="text-xs font-medium text-amber-600 border border-amber-400/40 bg-amber-400/10 hover:border-amber-400/70 px-2 py-0.5 rounded-md transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Streaming view — renders markdown live */}
      {isStreaming && (
        <div className="px-3 py-2.5" style={{ minHeight: `${rows * 1.625}rem` }}>
          <div className="prose prose-sm max-w-none text-foreground
            [&>p]:mb-1.5 [&>p]:text-sm [&>p]:text-foreground
            [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-1.5 [&>ul>li]:text-sm [&>ul>li]:text-foreground
            [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:mb-1.5 [&>ol>li]:text-sm [&>ol>li]:text-foreground
            [&>strong]:font-semibold [&>strong]:text-foreground">
            <ReactMarkdown>{toMd(streamingText ?? "")}</ReactMarkdown>
            <span className="inline-block w-0.5 bg-accent animate-pulse align-middle ml-0.5" style={{ height: "1em" }} />
          </div>
        </div>
      )}

      {/* Preview / read view — with floating sparkles inside */}
      {!isStreaming && !editMode && hasContent && (
        <div className="relative">
          <div className="px-3 py-2.5 text-sm text-foreground" style={{ minHeight: `${rows * 1.625}rem` }}>
            <div className="prose prose-sm max-w-none text-foreground
              [&>p]:mb-1.5 [&>p]:text-sm [&>p]:text-foreground
              [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-1.5 [&>ul>li]:text-sm [&>ul>li]:text-foreground
              [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:mb-1.5 [&>ol>li]:text-sm [&>ol>li]:text-foreground
              [&>strong]:font-semibold [&>strong]:text-foreground">
              <ReactMarkdown>{toMd(value)}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Empty — plain textarea */}
      {!isStreaming && !editMode && !hasContent && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-3 py-2.5 bg-transparent text-sm text-foreground placeholder:text-foreground-muted outline-none resize-none rounded-b-lg"
        />
      )}

      {/* Edit textarea */}
      {editMode && (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          rows={rows}
          autoFocus
          className="w-full px-3 py-2.5 bg-transparent text-sm text-foreground outline-none resize-none font-mono leading-relaxed rounded-b-lg"
        />
      )}

      {/* Refine form — below content, matches workspace pattern */}
      {showRefine && (
        <div className="px-3 py-2.5 border-t border-input-border space-y-2">
          <textarea
            ref={refineRef}
            value={refinement}
            onChange={(e) => setRefinement(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); applyRefinement(); } }}
            placeholder="What would you like to change? (⌘↵ to apply)"
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-input-border bg-background text-sm text-foreground placeholder:text-foreground-muted outline-none focus:border-accent resize-none"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => { setShowRefine(false); setRefinement(""); }}
              className="text-xs text-foreground-secondary hover:text-foreground px-3 py-1.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={applyRefinement}
              disabled={!refinement.trim()}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
