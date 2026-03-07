"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { createEmptyPayload, type OnboardingPayload } from "@/lib/onboarding-payload";
import { OnboardingNav } from "./components/OnboardingNav";
import { WelcomeStep } from "./components/WelcomeStep";
import { ProjectModeStep } from "./components/ProjectModeStep";
import { ToolIdeaStep } from "./components/ToolIdeaStep";
import { UsersRolesStep } from "./components/UsersRolesStep";
import { WorkflowsStep } from "./components/WorkflowsStep";
import { FilesStep } from "./components/FilesStep";
import { ReviewStep } from "./components/ReviewStep";
import { BottomNav } from "./components/BottomNav";

export type StepId =
  | "start"
  | "projectMode"
  | "toolIdea"
  | "usersRoles"
  | "workflows"
  | "files"
  | "review";

const STEP_ORDER: StepId[] = [
  "start",
  "projectMode",
  "toolIdea",
  "usersRoles",
  "workflows",
  "files",
  "review",
];

export default function OnboardingPage() {
  const router = useRouter();
  const saveOnboarding = useMutation(api.onboarding.save);
  const [onboardingId, setOnboardingId] = useState<Id<"onboarding"> | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());
  const [payload, setPayload] = useState<OnboardingPayload>(createEmptyPayload());

  const currentStepId = STEP_ORDER[currentStepIndex];

  function updatePayload(updates: Partial<OnboardingPayload>) {
    setPayload((prev) => ({ ...prev, ...updates }));
  }

  function goToStep(index: number) {
    if (index >= 0 && index < STEP_ORDER.length) {
      if (index > currentStepIndex) {
        setCompletedSteps((prev) => new Set(prev).add(currentStepId));
      }
      setCurrentStepIndex(index);
    }
  }

  function handleNext() {
    goToStep(currentStepIndex + 1);
  }

  function handleBack() {
    goToStep(currentStepIndex - 1);
  }

  function handleStepClick(stepId: StepId) {
    const targetIndex = STEP_ORDER.indexOf(stepId);
    if (targetIndex <= currentStepIndex || completedSteps.has(STEP_ORDER[targetIndex - 1])) {
      setCurrentStepIndex(targetIndex);
    }
  }

  async function handleSave() {
    const id = await saveOnboarding({
      id: onboardingId ?? undefined,
      ...payload,
      status: "draft",
    });
    setOnboardingId(id);
  }

  async function handleSubmit() {
    const id = await saveOnboarding({
      id: onboardingId ?? undefined,
      ...payload,
      status: "submitted",
    });
    router.push(`/dashboard?onboardingId=${id}`);
  }

  function canProceed(): boolean {
    switch (currentStepId) {
      case "start":
      case "projectMode":
      case "usersRoles":
      case "workflows":
      case "files":
        return true;
      case "toolIdea":
        return payload.toolDescription.trim().length > 0;
      case "review":
        return false;
      default:
        return false;
    }
  }

  const userName = "John Doe"; // Would come from auth

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <OnboardingNav
        steps={STEP_ORDER}
        currentStep={currentStepId}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
        onSave={handleSave}
      />

      <main className="flex flex-1 justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1280px] rounded-xl bg-card-bg min-h-[calc(100vh-160px)] flex flex-col items-center justify-center relative">
          {currentStepId === "start" && (
            <WelcomeStep userName={userName} onStart={handleNext} />
          )}

          {currentStepId === "projectMode" && (
            <ProjectModeStep
              projectMode={payload.projectMode}
              onChange={(mode) => updatePayload({ projectMode: mode })}
              onContinue={handleNext}
            />
          )}

          {currentStepId === "toolIdea" && (
            <ToolIdeaStep
              value={payload.toolDescription}
              onChange={(v) => updatePayload({ toolDescription: v })}
              onContinue={handleNext}
            />
          )}

          {currentStepId === "usersRoles" && (
            <UsersRolesStep
              userRoles={payload.userRoles}
              accessControl={payload.accessControl}
              onChange={updatePayload}
              onContinue={handleNext}
            />
          )}

          {currentStepId === "workflows" && (
            <WorkflowsStep
              keyWorkflows={payload.keyWorkflows}
              approvals={payload.approvals}
              notifications={payload.notifications}
              onChange={updatePayload}
              onContinue={handleNext}
            />
          )}

          {currentStepId === "files" && (
            <FilesStep
              files={payload.uploadedFiles}
              onChange={(files) => updatePayload({ uploadedFiles: files })}
              onContinue={handleNext}
            />
          )}

          {currentStepId === "review" && (
            <ReviewStep payload={payload} onSubmit={handleSubmit} />
          )}

          <BottomNav
            onBack={handleBack}
            onForward={handleNext}
            canGoBack={currentStepIndex > 0}
            canGoForward={canProceed()}
          />
        </div>
      </main>
    </div>
  );
}
