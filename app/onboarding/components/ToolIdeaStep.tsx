"use client";

import { useTranslation } from "@/lib/i18n";

const EXAMPLES = [
  {
    label: "IT Incident Portal",
    text: "We need an internal portal where employees can report IT incidents, support teams can triage and resolve them, and critical fixes become tracked change requests requiring manager approval before rollout. The system should track SLAs, send automated email reminders, and provide a dashboard with incident trends and resolution times.",
  },
  {
    label: "Team Task Tracker",
    text: "A lightweight internal web app where teams can create tasks, assign owners, set due dates, and track status across projects. Managers need a Kanban board view and burndown charts. Tasks should support sub-tasks, file attachments, and comment threads. Email notifications for assignments and approaching deadlines.",
  },
  {
    label: "Employee Onboarding",
    text: "A self-service onboarding platform for new hires. HR can create onboarding checklists per department (e.g. IT setup, compliance training, buddy assignment). New employees follow a guided checklist with due dates. Managers see completion status. Automatic reminders for overdue tasks, with a final sign-off by HR.",
  },
  {
    label: "Contract Approvals",
    text: "An internal tool for routing contracts through a multi-stage approval workflow. Legal drafts the contract, it gets reviewed by Finance, then approved by a C-level executive. Each stage has a configurable deadline, comment thread, and version history. Rejected contracts return to the drafter with feedback. Full audit log required.",
  },
];

interface ToolIdeaStepProps {
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
}

export function ToolIdeaStep({ value, onChange, onContinue }: ToolIdeaStepProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl w-full px-8 py-12">
      <div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            {t("onboarding.toolIdea.title")}
          </h2>
          <p className="text-foreground-secondary text-base leading-relaxed mb-4">
            {t("onboarding.toolIdea.question")}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => onChange(ex.text)}
                className="text-xs px-3 py-1.5 rounded-full border border-border text-foreground-secondary hover:border-accent hover:text-accent transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>

          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ask anything…"
            rows={6}
            className="w-full rounded-lg border border-input-border bg-input-bg p-4 text-foreground placeholder:text-foreground-muted outline-none transition-colors focus:border-input-border-focus resize-none"
          />

          <div className="mt-8 flex justify-center">
            <button
              onClick={onContinue}
              disabled={!value.trim()}
              className="rounded-full bg-primary px-12 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("onboarding.questions.continue")}
            </button>
          </div>
      </div>
    </div>
  );
}
