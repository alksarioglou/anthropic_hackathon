"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import type { Project } from "@/types";
import { SparklesIcon } from "./icons";

const FIELD_LABELS: Record<string, string> = {
  userRoles: "Users & Roles",
  accessControl: "Access Control",
  keyWorkflows: "Key Workflows",
  approvals: "Approvals",
  notifications: "Notifications",
};

function QuestionEditModal({
  label,
  value,
  onSave,
  onClose,
}: {
  label: string;
  value: string;
  onSave: (v: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    textareaRef.current?.select();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onSave(text); }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/85 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl mx-6 rounded-2xl border border-amber-500/40 bg-background shadow-xl flex flex-col animate-modal-in">
        <div className="px-6 py-4 flex items-center justify-between border-b border-border">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted mb-0.5">Editing</p>
            <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground text-lg leading-none transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-6 flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={10}
            className="w-full bg-background-secondary rounded-xl border border-input-border px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary resize-none leading-relaxed"
          />
          <p className="mt-2 text-xs text-foreground-muted">⌘↵ to save · Esc to cancel</p>
        </div>
        <div className="px-6 pb-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-sm text-foreground-muted hover:text-foreground px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(text)}
            className="text-sm font-medium text-amber-600 border border-amber-500/40 bg-amber-500/10 hover:border-amber-500/70 px-4 py-2 rounded-lg transition-colors"
          >
            Update & Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}

function SidebarQuestionRow({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string;
  onSave?: (newValue: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  function handleSave(newValue: string) {
    onSave?.(newValue);
    setModalOpen(false);
  }

  return (
    <>
      <div className="border-b border-border last:border-b-0">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-background-secondary transition-colors group"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <svg
              className={`w-3 h-3 text-foreground-muted shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
              viewBox="0 0 16 16" fill="currentColor"
            >
              <path d="M6 3l5 5-5 5V3z" />
            </svg>
            <span className="text-xs font-medium text-foreground-secondary truncate">{label}</span>
          </div>
          {onSave && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
              className="opacity-0 group-hover:opacity-100 text-xs text-foreground-muted hover:text-foreground border border-border hover:border-foreground-muted px-1.5 py-0.5 rounded transition-all duration-150 cursor-pointer"
            >
              Edit
            </span>
          )}
        </button>

        <div className={`overflow-hidden transition-all duration-200 ${open ? "max-h-[600px]" : "max-h-0"}`}>
          <div className="px-3 pb-2 pl-7">
            <div className="md-content text-xs text-foreground-secondary">
              <ReactMarkdown>{value.replace(/^[•·‣▸] /gm, "- ")}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <QuestionEditModal
          label={label}
          value={value}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

function IdeaEditModal({
  value,
  onSave,
  onClose,
}: {
  value: string;
  onSave: (v: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    textareaRef.current?.select();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onSave(text); }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/85 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl mx-6 rounded-2xl border border-border bg-background shadow-xl flex flex-col animate-modal-in">
        <div className="px-6 py-4 flex items-center justify-between border-b border-border">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted mb-0.5">Editing</p>
            <h3 className="text-sm font-semibold text-foreground">Project Idea</h3>
          </div>
          <button onClick={onClose} className="text-foreground-muted hover:text-foreground text-lg leading-none transition-colors">×</button>
        </div>
        <div className="p-6 flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={10}
            className="w-full bg-background-secondary rounded-xl border border-input-border px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary resize-none leading-relaxed"
          />
          <p className="mt-2 text-xs text-foreground-muted">⌘↵ to save · Esc to cancel</p>
        </div>
        <div className="px-6 pb-5 flex justify-end gap-2">
          <button onClick={onClose} className="text-sm text-foreground-muted hover:text-foreground px-4 py-2 rounded-lg transition-colors">Cancel</button>
          <button
            onClick={() => onSave(text)}
            className="text-sm font-medium text-primary border border-primary/30 bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors"
          >
            Update & Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}

function AIRefineModal({
  currentValue,
  onApply,
  onClose,
  isRefining,
  streamingDesc,
}: {
  currentValue: string;
  onApply: (instruction: string) => void;
  onClose: () => void;
  isRefining: boolean;
  streamingDesc: string | null;
}) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape" && !isRefining) onClose();
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); if (text.trim()) onApply(text); }
  }

  const showingStream = isRefining || streamingDesc !== null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/85 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget && !isRefining) onClose(); }}
    >
      <div className="w-full max-w-2xl mx-6 rounded-2xl border border-primary/40 bg-background shadow-xl flex flex-col animate-modal-in">
        <div className="px-6 py-4 flex items-center justify-between border-b border-border">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted mb-0.5">AI Refinement</p>
            <h3 className="text-sm font-semibold text-foreground">Refine Project Idea</h3>
          </div>
          {!isRefining && (
            <button onClick={onClose} className="text-foreground-muted hover:text-foreground text-lg leading-none transition-colors">×</button>
          )}
        </div>

        <div className="px-6 pt-4 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted mb-1.5">Current Idea</p>
          <p className="text-xs text-foreground-secondary leading-relaxed max-h-20 overflow-y-auto line-clamp-4">{currentValue}</p>
        </div>

        <div className="p-6 flex-1 space-y-3">
          {!showingStream ? (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted">Refinement Instruction</p>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="How should the idea be refined? E.g. 'Add role-based access and email reminders'"
                rows={4}
                className="w-full bg-background-secondary rounded-xl border border-input-border px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary resize-none leading-relaxed"
              />
              <p className="text-xs text-foreground-muted">⌘↵ to apply · Esc to cancel</p>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-primary animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                Refining…
              </div>
              {streamingDesc !== null && (
                <pre className="text-xs text-foreground-secondary whitespace-pre-wrap leading-relaxed font-sans max-h-48 overflow-y-auto">
                  {streamingDesc}
                  <span className="inline-block w-0.5 h-3 bg-primary animate-pulse align-middle ml-0.5" />
                </pre>
              )}
            </div>
          )}
        </div>

        {!showingStream && (
          <div className="px-6 pb-5 flex justify-end gap-2">
            <button onClick={onClose} className="text-sm text-foreground-muted hover:text-foreground px-4 py-2 rounded-lg transition-colors">Cancel</button>
            <button
              onClick={() => { if (text.trim()) onApply(text); }}
              disabled={!text.trim()}
              className="text-sm font-medium text-primary border border-primary/30 bg-primary/10 hover:bg-primary/20 disabled:opacity-40 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              Apply AI Refinement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface IdeaPanelProps {
  project: Project;
  onUpdateIdea: (desc: string) => void;
  onUpdateQuestionnaire?: (field: string, value: string) => void;
}

export function IdeaPanel({ project, onUpdateIdea, onUpdateQuestionnaire }: IdeaPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [ideaModalOpen, setIdeaModalOpen] = useState(false);
  const [aiRefineModalOpen, setAiRefineModalOpen] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [streamingDesc, setStreamingDesc] = useState<string | null>(null);

  const description = project.description ?? project.idea.split("\n\n")[0];
  const q = project.questionnaire;

  async function applyRefinement(instruction: string) {
    if (!instruction.trim() || isRefining) return;
    setIsRefining(true);
    setStreamingDesc("");
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
          if (parsed.chunk !== undefined) {
            accumulated += parsed.chunk;
            setStreamingDesc(accumulated);
          }
        }
      }
      setStreamingDesc(null);
      onUpdateIdea(accumulated);
      setAiRefineModalOpen(false);
    } catch { /* silent */ } finally {
      setIsRefining(false);
      setStreamingDesc(null);
    }
  }

  return (
    <>
    {ideaModalOpen && (
      <IdeaEditModal
        value={description}
        onSave={(v) => { onUpdateIdea(v); setIdeaModalOpen(false); }}
        onClose={() => setIdeaModalOpen(false)}
      />
    )}
    {aiRefineModalOpen && (
      <AIRefineModal
        currentValue={description}
        onApply={applyRefinement}
        onClose={() => { if (!isRefining) setAiRefineModalOpen(false); }}
        isRefining={isRefining}
        streamingDesc={streamingDesc}
      />
    )}
    <div
      className="rounded-xl bg-background border border-border animate-fade-in overflow-hidden"
    >
      {/* Collapsible header */}
      <div
        className="px-4 py-2.5 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
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
            <p className="text-xs text-foreground-secondary truncate ml-1 max-w-[140px]">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {!isRefining && (
            <>
              <button
                onClick={() => { setAiRefineModalOpen(true); setExpanded(true); }}
                title="Refine with AI"
                className="p-1.5 rounded-lg border border-border text-foreground-muted hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <SparklesIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIdeaModalOpen(true)}
                className="text-xs text-foreground-muted hover:text-foreground border border-border hover:border-foreground-muted px-2 py-0.5 rounded-md transition-colors"
              >
                Edit
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

      {/* Collapsible body with animated height */}
      <div className={`overflow-hidden transition-all duration-200 ${expanded ? "max-h-[800px]" : "max-h-0"}`}>
        <div className="border-t border-border" />
        <div className="px-3 py-2">
          <p className="text-xs text-foreground-secondary whitespace-pre-line max-h-24 overflow-y-auto leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Questionnaire rows */}
      {q && (q.userRoles || q.accessControl || q.keyWorkflows || q.approvals || q.notifications) && (
        <div className="border-t border-border">
          {(["userRoles", "accessControl", "keyWorkflows", "approvals", "notifications"] as const).map((field) =>
            q[field] ? (
              <SidebarQuestionRow
                key={field}
                label={FIELD_LABELS[field]}
                value={q[field]!}
                onSave={onUpdateQuestionnaire ? (v) => onUpdateQuestionnaire(field, v) : undefined}
              />
            ) : null
          )}
        </div>
      )}
    </div>
    </>
  );
}
