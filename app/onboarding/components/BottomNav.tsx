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
      {/* Back button - coral/salmon with up chevron */}
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={`
          flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors
          ${
            canGoBack
              ? "bg-[#D9534F] text-white hover:bg-[#C9302C]"
              : "bg-[#E8B4B4] text-white/70 cursor-not-allowed"
          }
        `}
      >
        {t("onboarding.nav.back")}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 8L6 4.5L9.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Forward button - dark red/maroon with down chevron */}
      <button
        onClick={onForward}
        disabled={!canGoForward}
        className={`
          flex items-center justify-center rounded-md p-2.5 transition-colors
          ${
            canGoForward
              ? "bg-[#8B1A1A] text-white hover:bg-[#6B1414]"
              : "bg-[#C4A0A0] text-white/70 cursor-not-allowed"
          }
        `}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3.5 5.5L7 9L10.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
