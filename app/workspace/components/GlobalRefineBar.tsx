"use client";

import { useState, useRef } from "react";
import { SparklesIcon } from "./icons";

interface GlobalRefineBarProps {
  isRefining: boolean;
  disabled?: boolean;
  onSubmit: (refinement: string) => Promise<void>;
}

export function GlobalRefineBar({ isRefining, disabled, onSubmit }: GlobalRefineBarProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleImprove() {
    if (!value.trim() || isImproving) return;
    setIsImproving(true);
    try {
      const res = await fetch("/api/improve-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: value }),
      });
      if (res.ok) {
        const { improved } = await res.json();
        if (improved) {
          setValue(improved);
          setTimeout(() => textareaRef.current?.focus(), 0);
        }
      }
    } finally {
      setIsImproving(false);
    }
  }

  async function handleSubmit() {
    if (!value.trim() || isRefining || disabled) return;
    const text = value.trim();
    setValue("");
    setFocused(false);
    await onSubmit(text);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setValue("");
      setFocused(false);
      textareaRef.current?.blur();
    }
  }

  const isActive = focused || value.length > 0;

  return (
    <div
      className={`fixed bottom-6 z-20 transition-all duration-200 ${
        isActive
          ? "left-[calc(20rem+2rem)] right-8 max-w-2xl"
          : "left-1/2 -translate-x-1/4 w-[min(480px,calc(100vw-24rem))]"
      }`}
    >
      <div
        className={`rounded-2xl border bg-background shadow-lg transition-colors ${
          isActive ? "border-primary/40 shadow-primary/10" : "border-border"
        }`}
      >
        <div className="px-4 pt-3 pb-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => { if (!value.trim()) setFocused(false); }}
            onKeyDown={handleKeyDown}
            placeholder={isRefining ? "Applying refinement…" : "Add a feature or describe a change… (⌘↵ to apply)"}
            rows={isActive ? 3 : 1}
            disabled={isRefining || disabled}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground-muted resize-none outline-none leading-relaxed disabled:opacity-50"
          />

          {isActive && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
              <button
                onClick={handleImprove}
                disabled={!value.trim() || isImproving || isRefining}
                className="flex items-center gap-1.5 text-xs text-foreground-muted hover:text-primary disabled:opacity-40 transition-colors"
                title="Let AI expand and improve your prompt"
              >
                <SparklesIcon className={`w-3.5 h-3.5 ${isImproving ? "animate-spin" : ""}`} />
                {isImproving ? "Improving…" : "Improve with AI"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setValue(""); setFocused(false); }}
                  className="text-xs text-foreground-muted hover:text-foreground px-3 py-1.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!value.trim() || isRefining || disabled}
                  className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-40 transition-colors"
                >
                  {isRefining ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                      Applying…
                    </>
                  ) : (
                    "Apply Refinement"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
