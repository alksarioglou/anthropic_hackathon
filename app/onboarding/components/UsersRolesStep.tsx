"use client";

import { useTranslation } from "@/lib/i18n";
import type { OnboardingPayload } from "@/lib/onboarding-payload";

interface UsersRolesStepProps {
  userRoles: string;
  accessControl: string;
  onChange: (updates: Partial<OnboardingPayload>) => void;
  onContinue: () => void;
}

export function UsersRolesStep({
  userRoles,
  accessControl,
  onChange,
  onContinue,
}: UsersRolesStepProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl w-full px-8">
      <div className="flex items-start gap-6">
        <span className="text-foreground-muted text-lg font-medium mt-0.5">
          4.
        </span>
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {t("onboarding.usersRoles.title")}
          </h2>
          <p className="text-foreground-secondary text-sm mb-2">
            {t("onboarding.usersRoles.description")}
          </p>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              {t("onboarding.usersRoles.rolesLabel")}
            </label>
            <textarea
              value={userRoles}
              onChange={(e) => onChange({ userRoles: e.target.value })}
              placeholder={t("onboarding.usersRoles.rolesPlaceholder")}
              rows={3}
              className="w-full rounded-lg border border-input-border bg-input-bg p-3 text-foreground placeholder:text-foreground-muted outline-none transition-colors focus:border-input-border-focus resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              {t("onboarding.usersRoles.accessLabel")}
            </label>
            <textarea
              value={accessControl}
              onChange={(e) => onChange({ accessControl: e.target.value })}
              placeholder={t("onboarding.usersRoles.accessPlaceholder")}
              rows={2}
              className="w-full rounded-lg border border-input-border bg-input-bg p-3 text-foreground placeholder:text-foreground-muted outline-none transition-colors focus:border-input-border-focus resize-none"
            />
          </div>

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
    </div>
  );
}
