"use client";

import { useTranslation } from "@/lib/i18n";

interface ToolIdeaStepProps {
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
}

export function ToolIdeaStep({ value, onChange, onContinue }: ToolIdeaStepProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl w-full px-8">
      <div className="flex items-start gap-6">
        <span className="text-foreground-muted text-lg font-medium mt-0.5">
          1.
        </span>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {t("onboarding.toolIdea.title")}
          </h2>
          <p className="text-foreground-secondary text-base mb-6">
            {t("onboarding.toolIdea.question")}
          </p>

          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t("onboarding.toolIdea.placeholder")}
            rows={6}
            className="w-full rounded-lg border border-input-border bg-input-bg p-4 text-foreground placeholder:text-foreground-muted outline-none transition-colors focus:border-input-border-focus resize-none"
          />

          <div className="mt-8 flex justify-center">
            <button
              onClick={onContinue}
              disabled={!value.trim()}
              className="rounded-full bg-primary px-12 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("onboarding.questions.continue")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
