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
    <div className="max-w-3xl w-full">
      <h2 className="text-xl font-medium text-foreground mb-2">
        {t("onboarding.toolIdea.title")}
      </h2>

      <div className="flex items-start gap-6 mt-6">
        <span className="text-foreground-muted text-base font-medium mt-0.5">
          2.
        </span>
        <div className="flex-1">
          <p className="text-foreground text-base mb-6">
            {t("onboarding.toolIdea.question")}
          </p>

          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t("onboarding.toolIdea.placeholder")}
            rows={6}
            className="w-full rounded-xl border border-border bg-white p-4 text-foreground placeholder:text-foreground-muted outline-none transition-colors focus:border-input-border-focus resize-none"
          />

          <div className="mt-10 flex justify-center">
            <button
              onClick={onContinue}
              disabled={!value.trim()}
              className="rounded-full bg-primary px-16 py-3.5 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("onboarding.questions.continue")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
