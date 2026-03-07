"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Show, SignUp, useUser } from "@clerk/nextjs";
import { MaturaLogo } from "@/components/MaturaLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/home");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;

  const features = [
    { icon: "\u2728", title: t("landing.featureIdeaTitle"), description: t("landing.featureIdeaDesc") },
    { icon: "\u{1F501}", title: t("landing.featureLoopTitle"), description: t("landing.featureLoopDesc") },
    { icon: "\u{1F4CA}", title: t("landing.featureViewsTitle"), description: t("landing.featureViewsDesc") },
    { icon: "\u{1F3D7}\uFE0F", title: t("landing.featureSdlcTitle"), description: t("landing.featureSdlcDesc") },
  ];

  return (
    <Show when="signed-out">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-nav-bg">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
            <MaturaLogo className="h-7" />
            <LanguageSwitcher />
          </div>
        </header>

        {/* Hero */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left: copy + features */}
            <div className="flex flex-col gap-8">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight whitespace-pre-line">
                  {t("landing.headline")}
                </h1>
                <p className="mt-4 text-lg text-foreground-secondary leading-relaxed max-w-lg">
                  {t("landing.subtitle")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="rounded-xl border border-border bg-card-bg p-4"
                  >
                    <span className="text-xl">{f.icon}</span>
                    <h3 className="mt-2 text-sm font-semibold text-foreground">
                      {f.title}
                    </h3>
                    <p className="mt-1 text-xs text-foreground-secondary leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-foreground-muted">
                {t("landing.footer")}
              </p>
            </div>

            {/* Right: Clerk SignUp */}
            <div className="flex justify-center lg:justify-end">
              <SignUp routing="hash" />
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}
