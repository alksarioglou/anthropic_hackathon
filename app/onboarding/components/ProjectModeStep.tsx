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
    <div className="max-w-3xl w-full">
      <h2 className="text-xl font-medium text-foreground mb-2">
        {t("onboarding.projectMode.title")}
      </h2>
      <p className="text-foreground-secondary text-sm mb-8">
        {t("onboarding.projectMode.description")}
      </p>

      <div className="flex items-start gap-6">
        <span className="text-foreground-muted text-base font-medium mt-0.5">
          1.
        </span>
        <div className="flex-1">
          <p className="text-foreground text-base mb-6">
            {t("onboarding.projectMode.title")}
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => onChange("internal")}
              className={`
                flex-1 rounded-xl border-2 p-6 text-left transition-all
                ${
                  projectMode === "internal"
                    ? "border-primary bg-white shadow-md"
                    : "border-border bg-white hover:border-foreground-muted"
                }
              `}
            >
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

            <button
              onClick={() => onChange("external")}
              className={`
                flex-1 rounded-xl border-2 p-6 text-left transition-all
                ${
                  projectMode === "external"
                    ? "border-primary bg-white shadow-md"
                    : "border-border bg-white hover:border-foreground-muted"
                }
              `}
            >
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

          <div className="mt-10 flex justify-center">
            <button
              onClick={onContinue}
              className="rounded-full bg-primary px-16 py-3.5 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              {t("onboarding.questions.continue")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
