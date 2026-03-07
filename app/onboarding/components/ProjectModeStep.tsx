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
    <div className="max-w-2xl w-full px-8 py-12">
      <div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            {t("onboarding.projectMode.title")}
          </h2>
          <p className="text-foreground-secondary text-base leading-relaxed mb-8">
            {t("onboarding.projectMode.description")}
          </p>

          <div className="flex gap-4">
            {/* Internal card */}
            <button
              onClick={() => onChange("internal")}
              className={`
                flex-1 rounded-xl border-2 p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg
                ${
                  projectMode === "internal"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-foreground-muted"
                }
              `}
            >
              <div className="text-2xl mb-3">
                {projectMode === "internal" ? "\u2705" : "\u{1F3E2}"}
              </div>
              <p
                className={`text-base font-semibold mb-2 ${
                  projectMode === "internal" ? "text-primary" : "text-foreground"
                }`}
              >
                {t("onboarding.projectMode.internal")}
              </p>
              <p className="text-sm text-foreground-secondary leading-relaxed">
                {t("onboarding.projectMode.internalDesc")}
              </p>
            </button>

            {/* External card */}
            <button
              onClick={() => onChange("external")}
              className={`
                flex-1 rounded-xl border-2 p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg
                ${
                  projectMode === "external"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-foreground-muted"
                }
              `}
            >
              <div className="text-2xl mb-3">
                {projectMode === "external" ? "\u2705" : "\u2601\uFE0F"}
              </div>
              <p
                className={`text-base font-semibold mb-2 ${
                  projectMode === "external" ? "text-primary" : "text-foreground"
                }`}
              >
                {t("onboarding.projectMode.external")}
              </p>
              <p className="text-sm text-foreground-secondary leading-relaxed">
                {t("onboarding.projectMode.externalDesc")}
              </p>
            </button>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onContinue}
              className="rounded-full bg-primary px-12 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              {t("onboarding.questions.continue")}
            </button>
          </div>
      </div>
    </div>
  );
}
