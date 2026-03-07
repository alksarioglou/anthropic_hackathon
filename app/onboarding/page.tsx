"use client";

import { useState, useRef } from "react";
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

// Fields that get AI pre-filled after the tool idea step
export type PrefillField = "userRoles" | "accessControl" | "keyWorkflows" | "approvals" | "notifications";

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
  const createProject = useMutation(api.projects.create);
  const [onboardingId] = useState<Id<"onboarding"> | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [animDir, setAnimDir] = useState<"forward" | "back">("forward");
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());
  const [payload, setPayload] = useState<OnboardingPayload>(createEmptyPayload());

  // AI prefill state — tracks streaming text per field while AI generates
  const [prefillStreaming, setPrefillStreaming] = useState<Partial<Record<PrefillField, string>>>({});
  const [prefillDone, setPrefillDone] = useState<Set<PrefillField>>(new Set());
  const prefillAccumRef = useRef<Partial<Record<PrefillField, string>>>({});
  const isPrefilling = useRef(false);

  const currentStepId = STEP_ORDER[currentStepIndex];

  function updatePayload(updates: Partial<OnboardingPayload>) {
    setPayload((prev) => ({ ...prev, ...updates }));
  }

  function goToStep(index: number) {
    if (index >= 0 && index < STEP_ORDER.length) {
      setAnimDir(index > currentStepIndex ? "forward" : "back");
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

  // Called when user clicks Continue on the ToolIdea step.
  // Moves to the next step immediately, then streams AI pre-fills in the background.
  async function handleToolIdeaContinue() {
    goToStep(currentStepIndex + 1);

    // Don't re-run if already prefilling or already done
    if (isPrefilling.current || prefillDone.size > 0) return;
    isPrefilling.current = true;

    try {
      const res = await fetch("/api/onboarding-prefill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolDescription: payload.toolDescription,
          projectMode: payload.projectMode,
        }),
      });
      if (!res.ok || !res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const parsed = JSON.parse(line) as {
            event?: string;
            field?: PrefillField;
            chunk?: string;
            done?: boolean;
          };

          if (parsed.field && parsed.chunk !== undefined) {
            // Accumulate streaming text
            prefillAccumRef.current[parsed.field] =
              (prefillAccumRef.current[parsed.field] ?? "") + parsed.chunk;
            const text = prefillAccumRef.current[parsed.field]!;
            setPrefillStreaming((prev) => ({ ...prev, [parsed.field!]: text }));
          }

          if (parsed.field && parsed.done) {
            const field = parsed.field;
            const finalText = prefillAccumRef.current[field] ?? "";
            // Commit to payload and mark as done
            updatePayload({ [field]: finalText });
            setPrefillDone((prev) => new Set(prev).add(field));
            setPrefillStreaming((prev) => {
              const next = { ...prev };
              delete next[field];
              return next;
            });
          }
        }
      }
    } catch {
      // Silently fail — user can fill in manually
    } finally {
      isPrefilling.current = false;
    }
  }

  async function handleSubmit() {
    // 1. Save onboarding record
    const obId = await saveOnboarding({
      id: onboardingId ?? undefined,
      ...payload,
      status: "submitted",
    });

    // 2. Build a rich idea string from all onboarding fields
    const ideaParts = [payload.toolDescription];
    if (payload.userRoles) ideaParts.push(`Users & roles: ${payload.userRoles}`);
    if (payload.accessControl) ideaParts.push(`Access control: ${payload.accessControl}`);
    if (payload.keyWorkflows) ideaParts.push(`Key workflows: ${payload.keyWorkflows}`);
    if (payload.approvals) ideaParts.push(`Approvals: ${payload.approvals}`);
    if (payload.notifications) ideaParts.push(`Notifications: ${payload.notifications}`);

    // 3. Create project record in Convex
    const projectId = await createProject({
      onboardingId: obId,
      name: payload.toolDescription.split(" ").slice(0, 6).join(" "),
      idea: ideaParts.join("\n\n"),
      description: payload.toolDescription,
      mode: payload.projectMode,
      dashboardStyle: "technical",
    });

    // 4. Navigate to workspace with project ID
    router.push(`/workspace?projectId=${projectId}`);
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

  const userName = "Jose Luis Latorre";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <OnboardingNav
        steps={STEP_ORDER}
        currentStep={currentStepId}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      <main className="flex flex-1 px-4 py-4 sm:px-6 lg:px-8">
        <div className="w-full rounded-2xl bg-card-bg min-h-[calc(100vh-100px)] flex flex-col justify-center relative px-8 sm:px-16 lg:px-24 overflow-hidden">
          <div
            key={currentStepIndex}
            className={`flex flex-col items-center w-full flex-1 justify-center ${animDir === "forward" ? "step-enter-next" : "step-enter-prev"}`}
          >
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
                onContinue={handleToolIdeaContinue}
              />
            )}

            {currentStepId === "usersRoles" && (
              <UsersRolesStep
                userRoles={payload.userRoles}
                accessControl={payload.accessControl}
                onChange={updatePayload}
                onContinue={handleNext}
                streamingFields={prefillStreaming}
              />
            )}

            {currentStepId === "workflows" && (
              <WorkflowsStep
                keyWorkflows={payload.keyWorkflows}
                approvals={payload.approvals}
                notifications={payload.notifications}
                onChange={updatePayload}
                onContinue={handleNext}
                streamingFields={prefillStreaming}
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
          </div>

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
