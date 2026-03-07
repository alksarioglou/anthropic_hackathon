"use client";

interface BottomNavProps {
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export function BottomNav({ onBack, onForward, canGoBack, canGoForward }: BottomNavProps) {
  return (
    <div className="fixed bottom-6 right-6 z-10 flex items-center gap-2">
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors
          ${canGoBack
            ? "bg-background border border-border text-foreground hover:bg-card-bg"
            : "bg-background border border-border text-foreground-muted cursor-not-allowed opacity-40"
          }`}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9L7 5L11 9" />
        </svg>
        Back
      </button>

      <button
        onClick={onForward}
        disabled={!canGoForward}
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors
          ${canGoForward
            ? "bg-primary text-primary-foreground hover:bg-primary-hover"
            : "bg-primary/40 text-primary-foreground/60 cursor-not-allowed"
          }`}
      >
        Continue
        <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 5L7 9L11 5" />
        </svg>
      </button>
    </div>
  );
}
