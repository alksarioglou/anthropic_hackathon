"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "@/lib/i18n";
import type { OnboardingPayload } from "@/lib/onboarding-payload";

interface ReviewStepProps {
  payload: OnboardingPayload;
  onSubmit: () => void;
}

function ReviewRow({ label, value, plain }: { label: string; value: string; plain?: boolean }) {
  return (
    <div className="py-3 border-b border-border-light">
      <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">
        {label}
      </p>
      {plain ? (
        <p className="text-sm text-foreground">{value}</p>
      ) : (
        <div className="prose prose-sm max-w-none text-foreground
          [&>p]:mb-1.5 [&>p]:text-sm [&>p]:text-foreground
          [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-1.5 [&>ul>li]:text-sm [&>ul>li]:text-foreground
          [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:mb-1.5 [&>ol>li]:text-sm [&>ol>li]:text-foreground
          [&>h1]:text-sm [&>h1]:font-semibold [&>h1]:text-foreground [&>h1]:mb-1
          [&>h2]:text-sm [&>h2]:font-semibold [&>h2]:text-foreground [&>h2]:mb-1
          [&>h3]:text-sm [&>h3]:font-medium [&>h3]:text-foreground [&>h3]:mb-1
          [&>strong]:font-semibold [&>strong]:text-foreground
          [&>blockquote]:border-l-2 [&>blockquote]:border-border [&>blockquote]:pl-3 [&>blockquote]:text-foreground-secondary">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      )}
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
          plain
        />
        <ReviewRow
          label={t("onboarding.review.projectModeLabel")}
          value={MODE_LABELS[payload.projectMode]}
          plain
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
