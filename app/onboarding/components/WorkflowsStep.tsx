"use client";

import { useTranslation } from "@/lib/i18n";
import type { OnboardingPayload } from "@/lib/onboarding-payload";
import type { PrefillField } from "../page";
import { StreamingField } from "./StreamingField";

interface WorkflowsStepProps {
  keyWorkflows: string;
  approvals: string;
  notifications: string;
  onChange: (updates: Partial<OnboardingPayload>) => void;
  onContinue: () => void;
  streamingFields?: Partial<Record<PrefillField, string>>;
}

export function WorkflowsStep({
  keyWorkflows,
  approvals,
  notifications,
  onChange,
  onContinue,
  streamingFields = {},
}: WorkflowsStepProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl w-full px-8 py-12">
      <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              {t("onboarding.workflows.title")}
            </h2>
            <p className="text-foreground-secondary text-base leading-relaxed">
              {t("onboarding.workflows.description")}
            </p>
          </div>

          <StreamingField
            label={t("onboarding.workflows.keyWorkflowsLabel")}
            value={keyWorkflows}
            streamingText={streamingFields.keyWorkflows}
            onChange={(v) => onChange({ keyWorkflows: v })}
            placeholder={t("onboarding.workflows.keyWorkflowsPlaceholder")}
            rows={3}
          />

          <StreamingField
            label={t("onboarding.workflows.approvalsLabel")}
            value={approvals}
            streamingText={streamingFields.approvals}
            onChange={(v) => onChange({ approvals: v })}
            placeholder={t("onboarding.workflows.approvalsPlaceholder")}
            rows={2}
          />

          <StreamingField
            label={t("onboarding.workflows.notificationsLabel")}
            value={notifications}
            streamingText={streamingFields.notifications}
            onChange={(v) => onChange({ notifications: v })}
            placeholder={t("onboarding.workflows.notificationsPlaceholder")}
            rows={2}
          />

          <div className="flex justify-center pt-4">
            <button
              onClick={onContinue}
              className="rounded-full bg-primary px-12 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              {t("onboarding.questions.continue")}
            </button>
          </div>
      </div>
    </div>
  );
}
