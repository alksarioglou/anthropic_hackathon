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
        // Streaming view — matches workspace streaming style
        <div
          className="w-full rounded-lg border border-input-border bg-input-bg p-3 text-foreground text-sm whitespace-pre-wrap leading-relaxed"
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
          className="w-full rounded-lg border border-input-border bg-input-bg p-3 text-foreground placeholder:text-foreground-muted outline-none transition-colors focus:border-input-border-focus resize-none"
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
    <div className="max-w-2xl w-full px-8">
      {/* Info card */}
      <div className="rounded-lg bg-white border border-border-light p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-medium text-foreground mb-3">
          {t("onboarding.usersRoles.title")}
        </h2>
        <p className="text-foreground-muted text-sm leading-relaxed">
          {t("onboarding.usersRoles.description")}
        </p>
      </div>

      {/* Question: Roles */}
      <div className="flex items-start gap-6 mb-8">
        <span className="text-foreground-muted text-base font-medium mt-0.5">
          3.
        </span>
        <div className="flex-1">
          <label className="text-foreground text-base block mb-3">
            {t("onboarding.usersRoles.rolesLabel")}
          </label>
          <textarea
            value={userRoles}
            onChange={(e) => onChange({ userRoles: e.target.value })}
            placeholder={t("onboarding.usersRoles.rolesPlaceholder")}
            rows={3}
            className="w-full rounded-lg border border-border-light bg-white p-4 text-foreground placeholder:text-foreground-muted outline-none transition-colors focus:border-input-border-focus shadow-sm resize-none"
          />
        </div>
      </div>

      {/* Question: Access Control */}
      <div className="flex items-start gap-6">
        <span className="text-foreground-muted text-base font-medium mt-0.5">
          4.
        </span>
        <div className="flex-1">
          <label className="text-foreground text-base block mb-3">
            {t("onboarding.usersRoles.accessLabel")}
          </label>
          <textarea
            value={accessControl}
            onChange={(e) => onChange({ accessControl: e.target.value })}
            placeholder={t("onboarding.usersRoles.accessPlaceholder")}
            rows={2}
            className="w-full rounded-lg border border-border-light bg-white p-4 text-foreground placeholder:text-foreground-muted outline-none transition-colors focus:border-input-border-focus shadow-sm resize-none"
          />
        </div>
      </div>

      <div className="flex justify-center pt-10">
        <button
          onClick={onContinue}
          className="rounded-full bg-[#D9534F] px-16 py-3.5 text-base font-medium text-white transition-colors hover:bg-[#C9302C] shadow-sm"
        >
          {t("onboarding.questions.continue")}
        </button>
      </div>
    </div>
  );
}
