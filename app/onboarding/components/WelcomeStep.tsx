"use client";

import { useTranslation } from "@/lib/i18n";

function PoweredByClaude({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-1.5 text-xs text-foreground-muted ${className}`}>
      Powered by
      {/* Anthropic-style mark */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
        <path d="M12 1L9.5 8.5H2L8 13L5.5 20.5L12 16L18.5 20.5L16 13L22 8.5H14.5L12 1Z" />
      </svg>
      <span className="font-semibold text-foreground-secondary">Claude</span>
    </span>
  );
}

interface WelcomeStepProps {
  userName: string;
  onStart: () => void;
}

export function WelcomeStep({ userName, onStart }: WelcomeStepProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl w-full py-12">
      <h1 className="text-4xl font-bold text-foreground mb-6">
        {t("onboarding.welcome.greeting", { name: userName })}
      </h1>

      <p className="text-foreground-secondary text-lg leading-relaxed mb-2">
        {t("onboarding.welcome.description")}{" "}
        <span className="italic text-accent">
          {t("onboarding.welcome.saveNote")}
        </span>
      </p>

      <div className="mt-8 flex flex-col items-center gap-4">
        <button
          onClick={onStart}
          className="rounded-full bg-primary px-16 py-3.5 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {t("onboarding.welcome.cta")}
        </button>
        <PoweredByClaude />
      </div>
    </div>
  );
}
