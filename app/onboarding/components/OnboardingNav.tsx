"use client";

import { useTranslation } from "@/lib/i18n";
import { MaturaLogo } from "@/components/MaturaLogo";
import type { StepId } from "../page";

interface OnboardingNavProps {
  steps: StepId[];
  currentStep: StepId;
  completedSteps: Set<StepId>;
  onStepClick: (stepId: StepId) => void;
  onSave: () => void;
}

const stepLabelKeys: Record<StepId, string> = {
  start: "onboarding.steps.start",
  projectMode: "onboarding.steps.projectMode",
  toolIdea: "onboarding.steps.toolIdea",
  usersRoles: "onboarding.steps.usersRoles",
  workflows: "onboarding.steps.workflows",
  files: "onboarding.steps.files",
  review: "onboarding.steps.review",
};

export function OnboardingNav({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  onSave,
}: OnboardingNavProps) {
  const { t } = useTranslation();

  return (
    <nav className="flex items-center justify-between border-b border-border bg-nav-bg px-4 sm:px-6 lg:px-8 h-16">
      <div className="flex items-center gap-6 overflow-x-auto">
        <MaturaLogo className="h-7" />

        <div className="flex items-center gap-1">
          {steps.map((stepId, index) => {
            const isActive = stepId === currentStep;
            const isCompleted = completedSteps.has(stepId);
            const isFirst = index === 0;
            const isLast = index === steps.length - 1;

            return (
              <button
                key={stepId}
                onClick={() => onStepClick(stepId)}
                className={`
                  relative flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap rounded transition-colors
                  ${
                    isActive
                      ? "text-primary font-medium"
                      : isCompleted
                        ? "text-success font-medium"
                        : "text-foreground-muted"
                  }
                  hover:text-foreground
                `}
              >
                {(isFirst || isLast) && (
                  <span className="text-xs">
                    {isCompleted ? "\u2713" : "\u2691"}
                  </span>
                )}
                {!isFirst && !isLast && (
                  <span className="text-xs">
                    {isCompleted ? "\u2713" : "\u203A"}
                  </span>
                )}
                {t(stepLabelKeys[stepId] as Parameters<typeof t>[0])}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={onSave}
        className={`
          ml-4 whitespace-nowrap rounded-full border px-5 py-2 text-sm font-medium transition-colors
          ${
            completedSteps.size > 0
              ? "border-primary bg-primary text-primary-foreground hover:bg-primary-hover"
              : "border-border text-foreground-secondary hover:bg-background-secondary"
          }
        `}
      >
        {t("onboarding.nav.saveProgress")}
      </button>
    </nav>
  );
}
