"use client";

import { useTranslation } from "@/lib/i18n";
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

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0">
      <circle cx="7.5" cy="7.5" r="6.5" stroke="#4CAF50" strokeWidth="1.5" />
      <path d="M4.5 7.5l2.2 2.2 3.8-4.2" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 opacity-50">
      <path d="M3 2v10M3 2h7l-2 3 2 3H3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="shrink-0 opacity-50">
      <path d="M1.5 1L6.5 6L1.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="shrink-0 opacity-40">
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function OnboardingNav({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  onSave,
}: OnboardingNavProps) {
  const { t } = useTranslation();

  const currentIndex = steps.indexOf(currentStep);
  const progressPercent = ((currentIndex) / (steps.length - 1)) * 100;

  return (
    <nav className="relative bg-white border-b border-[#E8E8E8]">
      {/* Progress bar — red line at the very top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent">
        <div
          className="h-full bg-[#E2001A] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center h-[64px] px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0 mr-6">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="3" y="7" width="18" height="18" rx="2" stroke="#E2001A" strokeWidth="1.8" />
            <rect x="11" y="3" width="18" height="18" rx="2" stroke="#E2001A" strokeWidth="1.8" fill="white" />
            <path d="M16 9l4 4-4 4" stroke="#E2001A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xl font-semibold text-[#1D1D1B] tracking-tight">
            {t("onboarding.brandName")}
          </span>
        </div>

        {/* Steps — spread evenly across available space */}
        <div className="flex items-center flex-1 justify-between">
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
                  flex items-center gap-1.5 text-[13px] whitespace-nowrap transition-colors
                  ${isActive ? "text-[#1D1D1B] font-semibold" : ""}
                  ${isCompleted ? "text-[#4CAF50] font-medium" : ""}
                  ${!isActive && !isCompleted ? "text-[#A0A0A0] font-normal" : ""}
                  hover:text-[#1D1D1B]
                `}
              >
                {/* Step icon */}
                {isCompleted ? (
                  <CheckIcon />
                ) : (isFirst || isLast) ? (
                  <FlagIcon />
                ) : (
                  <ChevronRight />
                )}

                <span>{t(stepLabelKeys[stepId] as Parameters<typeof t>[0])}</span>

                {/* Dropdown chevron for middle steps */}
                {!isFirst && !isLast && (
                  <ChevronDown />
                )}
              </button>
            );
          })}
        </div>

        {/* Save Progress */}
        <button
          onClick={onSave}
          className="ml-6 shrink-0 whitespace-nowrap rounded-md border border-[#D4D4D4] bg-white px-5 py-2 text-[13px] font-medium text-[#666] transition-colors hover:border-[#999] hover:text-[#333]"
        >
          {t("onboarding.nav.saveProgress")}
        </button>
      </div>
    </nav>
  );
}
