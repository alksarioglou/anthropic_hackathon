"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";

interface QuestionStepProps {
  stepId: string;
  questionNumber: number;
  questionText: string;
  currentAnswer: string;
  onContinue: (answer: string) => void;
}

export function QuestionStep({
  questionNumber,
  questionText,
  currentAnswer,
  onContinue,
}: QuestionStepProps) {
  const { t } = useTranslation();
  const [answer, setAnswer] = useState(currentAnswer);

  function handleSubmit() {
    if (answer.trim()) {
      onContinue(answer.trim());
      setAnswer("");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="max-w-2xl w-full px-8">
      <div className="flex items-start gap-6">
        <span className="text-foreground-muted text-lg font-medium mt-0.5">
          {questionNumber}.
        </span>
        <div className="flex-1">
          <p className="text-foreground text-lg mb-6">{questionText}</p>

          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("onboarding.questions.placeholder")}
            className="w-full border-b-2 border-input-border bg-transparent py-2 text-foreground placeholder:text-foreground-muted outline-none transition-colors focus:border-input-border-focus"
          />

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!answer.trim()}
              className="rounded-full bg-primary px-12 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("onboarding.questions.continue")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
