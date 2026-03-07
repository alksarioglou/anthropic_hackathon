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
              : "bg-background-tertiary text-foreground-muted cursor-not-allowed"
          }
        `}
      >
        {t("onboarding.nav.back")}
        <span className="text-xs">{"\u2303"}</span>
      </button>

      <button
        onClick={onForward}
        disabled={!canGoForward}
        className={`
          flex items-center justify-center rounded-full p-2.5 text-sm font-medium transition-colors
          ${
            canGoForward
              ? "bg-primary text-primary-foreground hover:bg-primary-hover"
              : "bg-background-tertiary text-foreground-muted cursor-not-allowed"
          }
        `}
      >
        <span className="text-xs">{"\u2304"}</span>
      </button>
    </div>
  );
}
