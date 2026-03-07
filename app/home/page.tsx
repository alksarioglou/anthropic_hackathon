"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserButton } from "@clerk/nextjs";
import { MaturaLogo } from "@/components/MaturaLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslation, useLocale } from "@/lib/i18n";

const DATE_LOCALES: Record<string, string> = { en: "en-GB", de: "de-DE", fr: "fr-FR" };

export default function HomePage() {
  const router = useRouter();
  const projects = useQuery(api.projects.list);
  const { t } = useTranslation();
  const locale = useLocale();

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString(DATE_LOCALES[locale] ?? "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-nav-bg">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
          <MaturaLogo className="h-7" />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex flex-1 px-4 py-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto rounded-2xl bg-card-bg min-h-[calc(100vh-100px)] px-8 sm:px-16 lg:px-24 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t("home.welcome")}
          </h1>
          <p className="text-foreground-secondary text-lg leading-relaxed mb-10">
            {t("home.subtitle")}
          </p>

          {/* Stats banner */}
          <div className="rounded-xl border border-border bg-background px-6 py-5 flex items-center justify-between mb-10">
            <div>
              <p className="text-foreground-muted text-sm">{t("home.totalProjects")}</p>
              <p className="text-3xl font-bold text-foreground">
                {projects?.length ?? "\u2014"}
              </p>
            </div>
            <button
              onClick={() => router.push("/onboarding")}
              className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              {t("home.newFlow")}
            </button>
          </div>

          {/* Tip banners */}
          <div className="space-y-3 mb-10">
            <div className="rounded-xl border border-border bg-background px-5 py-3.5 flex items-center gap-3">
              <span className="text-accent text-lg">&#x2728;</span>
              <p className="text-sm text-foreground-secondary">
                {t("home.tipGenerate")}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background px-5 py-3.5 flex items-center gap-3">
              <span className="text-accent text-lg">&#x1F501;</span>
              <p className="text-sm text-foreground-secondary">
                {t("home.tipRefine")}
              </p>
            </div>
          </div>

          {/* Projects table */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-foreground">{t("home.yourFlows")}</h2>
            <button
              onClick={() => router.push("/onboarding")}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              {t("home.createNewFlow")}
            </button>
          </div>

          {projects === undefined && (
            <div className="rounded-xl border border-border bg-background p-12 text-center">
              <p className="text-foreground-muted text-sm">{t("home.loading")}</p>
            </div>
          )}

          {projects && projects.length === 0 && (
            <div className="rounded-xl border border-border bg-background p-12 text-center">
              <p className="text-foreground-muted text-sm mb-4">
                {t("home.noFlows")}
              </p>
              <button
                onClick={() => router.push("/onboarding")}
                className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                {t("home.createFirstFlow")}
              </button>
            </div>
          )}

          {projects && projects.length > 0 && (
            <div className="rounded-xl border border-border bg-background overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-xs font-medium text-foreground-muted uppercase tracking-wider">
                <div className="col-span-4">{t("home.project")}</div>
                <div className="col-span-2">{t("home.mode")}</div>
                <div className="col-span-2">{t("home.created")}</div>
                <div className="col-span-4 text-right">{t("home.actions")}</div>
              </div>

              {/* Table rows */}
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border-light last:border-b-0 items-center hover:bg-card-bg transition-colors"
                >
                  <div className="col-span-4 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {project.name}
                    </p>
                    {project.description && (
                      <p className="text-xs text-foreground-muted truncate mt-0.5">
                        {project.description}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`inline-flex text-xs px-3 py-1 rounded-full font-medium ${
                        project.mode === "internal"
                          ? "bg-accent/10 text-accent"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {project.mode === "internal" ? t("home.internal") : t("home.external")}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm text-foreground-secondary">
                      {formatDate(project.createdAt)}
                    </p>
                  </div>

                  <div className="col-span-4 flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        router.push(`/workspace?projectId=${project._id}`)
                      }
                      className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-foreground-secondary hover:text-foreground hover:border-foreground-muted transition-colors"
                    >
                      {t("home.workspace")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
