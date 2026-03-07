"use client";

import { useTranslation } from "@/lib/i18n";
import type { OnboardingPayload } from "@/lib/onboarding-payload";
import type { PrefillField } from "../page";
import { StreamingField } from "./StreamingField";

interface UsersRolesStepProps {
  userRoles: string;
  accessControl: string;
  onChange: (updates: Partial<OnboardingPayload>) => void;
  streamingFields?: Partial<Record<PrefillField, string>>;
}

export function UsersRolesStep({
  userRoles,
  accessControl,
  onChange,
  streamingFields = {},
}: UsersRolesStepProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl w-full py-12">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            {t("onboarding.usersRoles.title")}
          </h2>
          <p className="text-foreground-secondary text-base leading-relaxed">
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

      </div>
    </div>
  );
}
