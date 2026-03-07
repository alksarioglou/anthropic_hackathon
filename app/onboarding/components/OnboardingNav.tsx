"use client";

import { UserButton } from "@clerk/nextjs";
import { useTranslation } from "@/lib/i18n";
import { MaturaLogo } from "@/components/MaturaLogo";
import type { StepId } from "../page";

interface OnboardingNavProps {
  steps: StepId[];
  currentStep: StepId;
  completedSteps: Set<StepId>;
  onStepClick: (stepId: StepId) => void;
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
}: OnboardingNavProps) {
  const { t } = useTranslation();

  const currentIndex = steps.indexOf(currentStep);
  const progressFraction = (currentIndex + 1) / steps.length;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-nav-bg">
      {/* Progress bar at the very top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressFraction * 100}%` }}
        />
      </div>

      <div className="flex items-center h-14 px-4 sm:px-6">
        <div className="shrink-0 mr-4">
          <MaturaLogo className="h-7" />
        </div>

        <div className="flex flex-1 items-center min-w-0">
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
                <span className={`text-xs ${isCompleted ? "text-success" : ""}`}>
                  {isCompleted ? "\u2713" : isFirst || isLast ? "\u2691" : "\u203A"}
                </span>
                <span>{t(stepLabelKeys[stepId] as Parameters<typeof t>[0])}</span>
              </button>
            );
          })}
        </div>

        <div className="shrink-0 ml-4">
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
