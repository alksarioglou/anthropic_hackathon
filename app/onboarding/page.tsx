"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { OnboardingNav } from "./components/OnboardingNav";
import { WelcomeStep } from "./components/WelcomeStep";
import { QuestionStep } from "./components/QuestionStep";
import { BottomNav } from "./components/BottomNav";

export type StepId =
  | "start"
  | "requirements"
  | "dataModel"
  | "workflows"
  | "integrations"
  | "finish";

const STEP_ORDER: StepId[] = [
  "start",
  "requirements",
  "dataModel",
  "workflows",
  "integrations",
  "finish",
];

// Questions per step (excluding start/finish)
const STEP_QUESTIONS: Record<string, { questionKey: string }[]> = {
  requirements: [
    { questionKey: "What problem does this internal tool need to solve?" },
    { questionKey: "Who are the primary users of this tool?" },
    { questionKey: "What are the key features you need?" },
  ],
  dataModel: [
    { questionKey: "What types of data will this tool manage?" },
    { questionKey: "Are there existing databases or data sources to integrate?" },
  ],
  workflows: [
    { questionKey: "Describe a typical workflow a user would follow." },
    { questionKey: "Are there any approval processes or multi-step actions?" },
  ],
  integrations: [
    { questionKey: "What existing tools or systems should this integrate with?" },
    { questionKey: "Do you need any external API connections?" },
  ],
};

export default function OnboardingPage() {
  const { t } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentStepId = STEP_ORDER[currentStepIndex];
  const questions = STEP_QUESTIONS[currentStepId] || [];
  const currentQuestion = questions[currentQuestionIndex];
  const isStartStep = currentStepId === "start";
  const isFinishStep = currentStepId === "finish";

  function handleStartClick() {
    setCompletedSteps((prev) => new Set(prev).add("start"));
    setCurrentStepIndex(1);
    setCurrentQuestionIndex(0);
  }

  function handleContinue(answer: string) {
    const key = `${currentStepId}-${currentQuestionIndex}`;
    setAnswers((prev) => ({ ...prev, [key]: answer }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCompletedSteps((prev) => new Set(prev).add(currentStepId));
      if (currentStepIndex < STEP_ORDER.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
        setCurrentQuestionIndex(0);
      }
    }
  }

  function handleBack() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      const prevStepId = STEP_ORDER[prevIndex];
      const prevQuestions = STEP_QUESTIONS[prevStepId] || [];
      setCurrentQuestionIndex(Math.max(0, prevQuestions.length - 1));
    }
  }

  function handleForward() {
    if (!isStartStep && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentStepIndex < STEP_ORDER.length - 1) {
      if (isStartStep) {
        handleStartClick();
      } else {
        setCompletedSteps((prev) => new Set(prev).add(currentStepId));
        setCurrentStepIndex((prev) => prev + 1);
        setCurrentQuestionIndex(0);
      }
    }
  }

  function handleStepClick(stepId: StepId) {
    const index = STEP_ORDER.indexOf(stepId);
    if (index <= currentStepIndex || completedSteps.has(STEP_ORDER[index - 1])) {
      setCurrentStepIndex(index);
      setCurrentQuestionIndex(0);
    }
  }

  function handleSave() {
    // Placeholder for save functionality
    console.log("Saving progress:", answers);
    alert("Progress saved!");
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
          {isStartStep && (
            <WelcomeStep userName={userName} onStart={handleStartClick} />
          )}

          {!isStartStep && !isFinishStep && currentQuestion && (
            <QuestionStep
              stepId={currentStepId}
              questionNumber={currentQuestionIndex + 1}
              questionText={currentQuestion.questionKey}
              currentAnswer={
                answers[`${currentStepId}-${currentQuestionIndex}`] || ""
              }
              onContinue={handleContinue}
            />
          )}

          {isFinishStep && (
            <div className="max-w-2xl px-8 text-center">
              <h2 className="text-3xl font-semibold text-foreground mb-4">
                Thank you!
              </h2>
              <p className="text-foreground-secondary text-lg leading-relaxed">
                We have all the information we need to start building your
                internal tool. You&apos;ll receive updates as your tool is being
                created.
              </p>
            </div>
          )}

          <BottomNav
            onBack={handleBack}
            onForward={handleForward}
            canGoBack={currentStepIndex > 0 || currentQuestionIndex > 0}
            canGoForward={currentStepIndex < STEP_ORDER.length - 1}
          />
        </div>
      </main>
    </div>
  );
}
