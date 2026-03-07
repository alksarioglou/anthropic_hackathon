"use client";

import { useTranslation } from "@/lib/i18n";
import type { OnboardingPayload } from "@/lib/onboarding-payload";

interface ProjectModeStepProps {
  projectMode: OnboardingPayload["projectMode"];
  onChange: (mode: OnboardingPayload["projectMode"]) => void;
  onContinue: () => void;
}

export function ProjectModeStep({
  projectMode,
  onChange,
  onContinue,
}: ProjectModeStepProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl w-full px-8">
      {/* Info card */}
      <div className="rounded-lg bg-white border border-border-light p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-medium text-foreground mb-3">
          {t("onboarding.projectMode.title")}
        </h2>
        <p className="text-foreground-muted text-sm leading-relaxed">
          {t("onboarding.projectMode.description")}
        </p>
      </div>

      {/* Question with number */}
      <div className="flex items-start gap-6">
        <span className="text-foreground-muted text-base font-medium mt-0.5">
          1.
        </span>
        <div className="flex-1">
          <p className="text-foreground text-base mb-6">
            {t("onboarding.projectMode.description")}
          </p>

          {/* Option cards - Yes/No style from reference */}
          <div className="flex gap-4">
            <button
              onClick={() => onChange("internal")}
              className={`
                flex-1 rounded-lg border bg-white p-5 text-left transition-all shadow-sm
                ${
                  projectMode === "internal"
                    ? "border-primary ring-1 ring-primary/20"
                    : "border-border-light hover:border-foreground-muted"
                }
              `}
            >
              <p className={`text-base font-medium ${
                projectMode === "internal" ? "text-primary" : "text-foreground"
              }`}>
                {t("onboarding.projectMode.internal")}
              </p>
              <p className="text-sm text-foreground-muted mt-1 leading-relaxed">
                {t("onboarding.projectMode.internalDesc")}
              </p>
            </button>

            <button
              onClick={() => onChange("external")}
              className={`
                flex-1 rounded-lg border bg-white p-5 text-left transition-all shadow-sm
                ${
                  projectMode === "external"
                    ? "border-primary ring-1 ring-primary/20"
                    : "border-border-light hover:border-foreground-muted"
                }
              `}
            >
              <p className={`text-base font-medium ${
                projectMode === "external" ? "text-primary" : "text-foreground"
              }`}>
                {t("onboarding.projectMode.external")}
              </p>
              <p className="text-sm text-foreground-muted mt-1 leading-relaxed">
                {t("onboarding.projectMode.externalDesc")}
              </p>
            </button>
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={onContinue}
              className="rounded-full bg-[#D9534F] px-16 py-3.5 text-base font-medium text-white transition-colors hover:bg-[#C9302C] shadow-sm"
            >
              {t("onboarding.questions.continue")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
