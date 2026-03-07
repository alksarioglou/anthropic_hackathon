"use client";

import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useTranslation } from "@/lib/i18n";
import { sampleData } from "@/lib/dashboard-data";

// Shared panels
import { BusinessCasePanel } from "./components/BusinessCasePanel";
import { StakeholdersPanel } from "./components/StakeholdersPanel";
import { SuccessMetricsPanel } from "./components/SuccessMetricsPanel";
import { TimelineRiskPanel } from "./components/TimelineRiskPanel";
import { OperationsPanel } from "./components/OperationsPanel";
import { GlossaryPanel } from "./components/GlossaryPanel";

// Internal-only panels
import { PainPointsPanel } from "./components/PainPointsPanel";
import { BuildVsBuyPanel } from "./components/BuildVsBuyPanel";
import { TrainingPanel } from "./components/TrainingPanel";

// External-only panels
import { CompliancePanel } from "./components/CompliancePanel";
import { UserResearchPanel } from "./components/UserResearchPanel";
import { DesignUxPanel } from "./components/DesignUxPanel";
import { SlaReleasePanel } from "./components/SlaReleasePanel";

export default function DashboardPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const onboardingId = searchParams.get("onboardingId") as Id<"onboarding"> | null;

  const onboarding = useQuery(
    api.onboarding.get,
    onboardingId ? { id: onboardingId } : "skip"
  );
  const techSpecs = useQuery(
    api.techSpecs.getByOnboarding,
    onboardingId ? { onboardingId } : "skip"
  );
  const generateTechSpecs = useAction(api.techSpecs.generate);

  const projectMode = onboarding?.projectMode ?? ("external" as "internal" | "external");
  const data = sampleData;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="flex items-center justify-between border-b border-border bg-nav-bg px-4 sm:px-6 lg:px-8 h-16 sticky top-0 z-10">
        <span className="text-lg font-bold text-foreground">
          {t("onboarding.brandName")}
        </span>
        <div className="flex items-center gap-4">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            projectMode === "internal"
              ? "bg-accent/10 text-accent"
              : "bg-primary/10 text-primary"
          }`}>
            {projectMode === "internal" ? "Internal" : "External"}
          </span>
          <span className="text-sm text-foreground-secondary">
            {t("dashboard.title")}
          </span>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ─── Generate Tech Specs ─── */}
          {onboardingId && (
            <section className="rounded-lg border border-border bg-background p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Technical Specifications</h3>
                  <p className="text-sm text-foreground-secondary mt-1">
                    {!techSpecs && "Generate a complete technical plan from your onboarding input."}
                    {techSpecs?.status === "pending" && "Ready to generate..."}
                    {techSpecs?.status === "generating" && "AI agents are generating your technical specs..."}
                    {techSpecs?.status === "completed" && "Technical specs generated successfully."}
                    {techSpecs?.status === "error" && `Error: ${techSpecs.error}`}
                  </p>
                </div>
                <button
                  onClick={() => generateTechSpecs({ onboardingId })}
                  disabled={techSpecs?.status === "generating"}
                  className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {techSpecs?.status === "generating" ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Generating...
                    </>
                  ) : techSpecs?.status === "completed" ? (
                    "Regenerate Tech Specs"
                  ) : (
                    "Generate Tech Specs"
                  )}
                </button>
              </div>

              {techSpecs?.status === "completed" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {([
                    ["Vision", techSpecs.vision],
                    ["Requirements", techSpecs.requirements],
                    ["Architecture", techSpecs.architecture],
                    ["Frameworks", techSpecs.frameworks],
                    ["Tests", techSpecs.tests],
                    ["Backlog", techSpecs.backlog],
                  ] as const).map(([title, content]) =>
                    content ? (
                      <div key={title} className="rounded-lg border border-border p-4 max-h-80 overflow-y-auto">
                        <h4 className="text-sm font-semibold text-foreground mb-2">{title}</h4>
                        <p className="text-xs text-foreground-secondary whitespace-pre-wrap">{content}</p>
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </section>
          )}

          {/* ─── SHARED: Strategic ─── */}
          <section>
            <h3 className="text-xs font-medium text-foreground-muted uppercase tracking-widest mb-3">Strategic & Business</h3>
            <div className="space-y-4">
              <BusinessCasePanel data={data.shared.businessCase} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SuccessMetricsPanel data={data.shared.successMetrics} />
                <TimelineRiskPanel data={data.shared.timeline} />
              </div>
            </div>
          </section>

          {/* ─── MODE-SPECIFIC: Internal ─── */}
          {projectMode === "internal" && (
            <section>
              <h3 className="text-xs font-medium text-error uppercase tracking-widest mb-3">Internal Analysis</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <PainPointsPanel data={data.internal.painPoints} />
                  <BuildVsBuyPanel data={data.internal.buildVsBuy} />
                </div>
                <TrainingPanel data={data.internal.trainingPlan} context="internal" />
              </div>
            </section>
          )}

          {/* ─── MODE-SPECIFIC: External ─── */}
          {projectMode === "external" && (
            <section>
              <h3 className="text-xs font-medium text-primary uppercase tracking-widest mb-3">External / Client-Facing Analysis</h3>
              <div className="space-y-4">
                <CompliancePanel data={data.external.compliance} />
                <UserResearchPanel data={data.external.userResearch} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <DesignUxPanel data={data.external.designUx} />
                  <SlaReleasePanel data={data.external.slaAndRelease} />
                </div>
                <TrainingPanel data={data.external.trainingPlan} context="external" />
              </div>
            </section>
          )}

          {/* ─── SHARED: Team & Operations ─── */}
          <section>
            <h3 className="text-xs font-medium text-foreground-muted uppercase tracking-widest mb-3">Team & Operations</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <StakeholdersPanel data={data.shared.stakeholders} />
                <OperationsPanel data={data.shared.operations} glossary={data.shared.glossary} />
              </div>
              <GlossaryPanel data={data.shared.glossary} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
