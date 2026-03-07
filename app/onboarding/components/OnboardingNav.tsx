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

  const currentIndex = steps.indexOf(currentStep);
  const progressFraction = (currentIndex + 1) / steps.length;

  return (
    <nav className="relative border-b border-border bg-nav-bg">
      {/* Red progress bar at the very top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressFraction * 100}%` }}
        />
      </div>

      <div className="flex items-center h-14 px-4 sm:px-6">
        {/* Logo — fixed width */}
        <div className="shrink-0 mr-4">
          <MaturaLogo className="h-7" />
        </div>

        {/* Steps — evenly distributed across remaining space */}
        <div className="flex flex-1 items-center">
          {steps.map((stepId, index) => {
            const isActive = stepId === currentStep;
            const isCompleted = completedSteps.has(stepId);
            const isFirst = index === 0;
            const isLast = index === steps.length - 1;
            const showChevron = !isFirst && !isLast;

            return (
              <button
                key={stepId}
                onClick={() => onStepClick(stepId)}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 py-2 text-[13px] whitespace-nowrap transition-colors
                  ${isFirst ? "justify-start" : ""}
                  ${isLast ? "justify-end" : ""}
                  ${
                    isActive
                      ? "text-foreground font-semibold"
                      : isCompleted
                        ? "text-success"
                        : "text-foreground-muted"
                  }
                  hover:text-foreground
                `}
              >
                {/* Step icon */}
                <span className={`text-xs ${isCompleted ? "text-success" : ""}`}>
                  {isCompleted
                    ? "\u2713"
                    : isLast
                      ? "\u2691"
                      : isFirst
                        ? "\u2691"
                        : "\u203A"}
                </span>
                <span>{t(stepLabelKeys[stepId] as Parameters<typeof t>[0])}</span>
                {/* Dropdown chevron */}
                {showChevron && (
                  <svg className="w-3 h-3 opacity-50" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 4.5L6 7.5L9 4.5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Save Progress button */}
        <div className="shrink-0 ml-4">
          <button
            onClick={onSave}
            className="whitespace-nowrap rounded-lg border border-border px-5 py-2 text-sm text-foreground-secondary transition-colors hover:bg-background-secondary"
          >
            {t("onboarding.nav.saveProgress")}
          </button>
        </div>
      </div>
    </nav>
  );
}
