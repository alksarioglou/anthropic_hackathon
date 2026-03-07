"use client";

import { useTranslation } from "@/lib/i18n";

interface WelcomeStepProps {
  userName: string;
  onStart: () => void;
}

export function WelcomeStep({ userName, onStart }: WelcomeStepProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl px-8 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-6">
        {t("onboarding.welcome.greeting", { name: userName })}
      </h1>

      <p className="text-foreground-secondary text-lg leading-relaxed mb-2">
        {t("onboarding.welcome.description")}{" "}
        <span className="italic text-accent">
          {t("onboarding.welcome.saveNote")}
        </span>
      </p>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onStart}
          className="rounded-full bg-primary px-12 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {t("onboarding.welcome.cta")}
        </button>
      </div>
    </div>
  );
}
