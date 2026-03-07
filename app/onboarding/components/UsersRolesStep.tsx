"use client";

import { useTranslation } from "@/lib/i18n";
import type { OnboardingPayload } from "@/lib/onboarding-payload";
import type { PrefillField } from "../page";
import { StreamingField } from "./StreamingField";

interface UsersRolesStepProps {
  userRoles: string;
  accessControl: string;
  onChange: (updates: Partial<OnboardingPayload>) => void;
  onContinue: () => void;
  streamingFields?: Partial<Record<PrefillField, string>>;
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
    <div className="max-w-2xl w-full px-8 py-12">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            {t("onboarding.usersRoles.title")}
          </h2>
          <p className="text-foreground-secondary text-sm leading-relaxed">
            {t("onboarding.usersRoles.description")}
          </p>
        </div>

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
            className="rounded-full bg-primary px-12 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            {t("onboarding.questions.continue")}
          </button>
        </div>
      </div>
    </div>
  );
}
