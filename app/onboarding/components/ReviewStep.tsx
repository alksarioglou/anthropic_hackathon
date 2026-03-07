"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import type { OnboardingPayload } from "@/lib/onboarding-payload";

interface ReviewStepProps {
  payload: OnboardingPayload;
  onSubmit: () => void;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 border-b border-border-light">
      <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm text-foreground whitespace-pre-wrap">{value}</p>
    </div>
  );
}

const MODE_LABELS: Record<string, string> = {
  internal: "Internal (On-Premise)",
  external: "External (Cloud)",
};

export function ReviewStep({ payload, onSubmit }: ReviewStepProps) {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit() {
    setSubmitting(true);
    onSubmit();
  }

  const np = t("onboarding.review.notProvided");

  return (
    <div className="max-w-2xl w-full px-8 overflow-y-auto max-h-[calc(100vh-240px)]">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        {t("onboarding.review.title")}
      </h2>

      <div className="rounded-lg border border-border bg-background p-6">
        <ReviewRow
          label={t("onboarding.review.toolIdeaLabel")}
          value={payload.toolDescription || np}
        />
        <ReviewRow
          label={t("onboarding.review.projectModeLabel")}
          value={MODE_LABELS[payload.projectMode]}
        />
        <ReviewRow
          label={t("onboarding.review.userRolesLabel")}
          value={payload.userRoles || np}
        />
        <ReviewRow
          label={t("onboarding.review.accessControlLabel")}
          value={payload.accessControl || np}
        />
        <ReviewRow
          label={t("onboarding.review.keyWorkflowsLabel")}
          value={payload.keyWorkflows || np}
        />
        <ReviewRow
          label={t("onboarding.review.approvalsLabel")}
          value={payload.approvals || np}
        />
        <ReviewRow
          label={t("onboarding.review.notificationsLabel")}
          value={payload.notifications || np}
        />
        <div className="py-3">
          <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-1">
            {t("onboarding.review.filesLabel")}
          </p>
          {payload.uploadedFiles.length === 0 ? (
            <p className="text-sm text-foreground">
              {t("onboarding.review.noFiles")}
            </p>
          ) : (
            <ul className="text-sm text-foreground space-y-1">
              {payload.uploadedFiles.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center pb-16">
        <button
          onClick={handleSubmit}
          disabled={submitting || !payload.toolDescription.trim()}
          className="rounded-full bg-primary px-12 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? t("onboarding.review.submitting")
            : t("onboarding.review.submit")}
        </button>
      </div>
    </div>
  );
}
