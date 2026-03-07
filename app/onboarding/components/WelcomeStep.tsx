"use client";

import { useTranslation } from "@/lib/i18n";

interface WelcomeStepProps {
  userName: string;
  onStart: () => void;
}

export function WelcomeStep({ userName, onStart }: WelcomeStepProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl px-8">
      <h1 className="text-3xl font-light text-foreground mb-6">
        {t("onboarding.welcome.greeting", { name: userName })}
      </h1>

      <p className="text-foreground-muted text-base leading-relaxed mb-2">
        {t("onboarding.welcome.description")}{" "}
        <span className="text-primary cursor-pointer hover:underline">
          {t("onboarding.welcome.saveNote")}
        </span>
      </p>

      <div className="mt-10 flex justify-center">
        <button
          onClick={onStart}
          className="rounded-full bg-[#D9534F] px-16 py-3.5 text-base font-medium text-white transition-colors hover:bg-[#C9302C] shadow-sm"
        >
          {t("onboarding.welcome.cta")}
        </button>
      </div>
    </div>
  );
}
