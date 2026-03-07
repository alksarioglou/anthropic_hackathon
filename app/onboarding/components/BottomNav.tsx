"use client";

import { useTranslation } from "@/lib/i18n";

interface BottomNavProps {
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export function BottomNav({
  onBack,
  onForward,
  canGoBack,
  canGoForward,
}: BottomNavProps) {
  const { t } = useTranslation();

  return (
    <div className="absolute bottom-6 right-6 flex items-center gap-2">
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={`
          flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors
          ${
            canGoBack
              ? "bg-primary text-primary-foreground hover:bg-primary-hover"
              : "bg-primary/40 text-primary-foreground/60 cursor-not-allowed"
          }
        `}
      >
        {t("onboarding.nav.back")}
        <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9L7 5L11 9" />
        </svg>
      </button>

      <button
        onClick={onForward}
        disabled={!canGoForward}
        className={`
          flex items-center justify-center rounded-lg w-10 h-10 text-sm font-medium transition-colors
          ${
            canGoForward
              ? "bg-primary-hover text-primary-foreground hover:bg-primary"
              : "bg-primary/40 text-primary-foreground/60 cursor-not-allowed"
          }
        `}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 5L7 9L11 5" />
        </svg>
      </button>
    </div>
  );
}
