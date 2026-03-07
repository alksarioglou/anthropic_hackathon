"use client";

import { useTranslation } from "@/lib/i18n";
import type { OnboardingPayload } from "@/lib/onboarding-payload";
import type { PrefillField } from "../page";

interface UsersRolesStepProps {
  userRoles: string;
  accessControl: string;
  onChange: (updates: Partial<OnboardingPayload>) => void;
  onContinue: () => void;
  streamingFields?: Partial<Record<PrefillField, string>>;
}

function StreamingField({
  label,
  value,
  streamingText,
  onChange,
  placeholder,
  rows,
}: {
  label: string;
  value: string;
  streamingText: string | undefined;
  onChange: (v: string) => void;
  placeholder: string;
  rows: number;
}) {
  const isStreaming = streamingText !== undefined;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {isStreaming && (
          <span className="flex items-center gap-1.5 text-xs text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            AI is writing…
          </span>
        )}
      </div>

      {isStreaming ? (
        <div
          className="w-full rounded-xl border border-border bg-white p-4 text-foreground text-sm whitespace-pre-wrap leading-relaxed"
          style={{ minHeight: `${rows * 1.625}rem` }}
        >
          {streamingText}
          <span
            className="inline-block w-0.5 bg-accent animate-pulse align-middle ml-0.5"
            style={{ height: "1em" }}
          />
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full rounded-xl border border-border bg-white p-4 text-foreground placeholder:text-foreground-muted outline-none transition-colors focus:border-input-border-focus resize-none"
        />
      )}
    </div>
  );
}

export function UsersRolesStep({
  userRoles,
  accessControl,
  onChange,
  onContinue,
  streamingFields = {},
}: UsersRolesStepProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl w-full">
      <h2 className="text-xl font-medium text-foreground mb-2">
        {t("onboarding.usersRoles.title")}
      </h2>
      <p className="text-foreground-secondary text-sm mb-6">
        {t("onboarding.usersRoles.description")}
      </p>

      <div className="flex items-start gap-6">
        <span className="text-foreground-muted text-base font-medium mt-0.5">
          3.
        </span>
        <div className="flex-1 space-y-6">
          <StreamingField
            label={t("onboarding.usersRoles.rolesLabel")}
            value={userRoles}
            streamingText={streamingFields.userRoles}
            onChange={(v) => onChange({ userRoles: v })}
            placeholder={t("onboarding.usersRoles.rolesPlaceholder")}
            rows={3}
          />

          <StreamingField
            label={t("onboarding.usersRoles.accessLabel")}
            value={accessControl}
            streamingText={streamingFields.accessControl}
            onChange={(v) => onChange({ accessControl: v })}
            placeholder={t("onboarding.usersRoles.accessPlaceholder")}
            rows={2}
          />

          <div className="flex justify-center pt-4">
            <button
              onClick={onContinue}
              className="rounded-full bg-primary px-16 py-3.5 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              {t("onboarding.questions.continue")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
