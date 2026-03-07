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
      {/* Info card */}
      <div className="rounded-lg bg-white border border-border-light p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-medium text-foreground mb-3">
          {t("onboarding.toolIdea.title")}
        </h2>
        <p className="text-foreground-muted text-sm leading-relaxed">
          {t("onboarding.toolIdea.question")}
        </p>
      </div>

      {/* Question with number */}
      <div className="flex items-start gap-6">
        <span className="text-foreground-muted text-base font-medium mt-0.5">
          2.
        </span>
        <div className="flex-1">
          <p className="text-foreground text-base mb-4">
            {t("onboarding.toolIdea.question")}
          </p>

          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t("onboarding.toolIdea.placeholder")}
            rows={6}
            className="w-full rounded-lg border border-border-light bg-white p-4 text-foreground placeholder:text-foreground-muted outline-none transition-colors focus:border-input-border-focus shadow-sm resize-none"
          />

          <div className="mt-10 flex justify-center">
            <button
              onClick={onContinue}
              disabled={!value.trim()}
              className="rounded-full bg-[#D9534F] px-16 py-3.5 text-base font-medium text-white transition-colors hover:bg-[#C9302C] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("onboarding.questions.continue")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
