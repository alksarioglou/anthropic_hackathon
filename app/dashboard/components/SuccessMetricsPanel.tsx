"use client";

import { DashboardPanel } from "./DashboardPanel";
import type { SharedData } from "@/lib/dashboard-data";

export function SuccessMetricsPanel({ data }: { data: SharedData["successMetrics"] }) {
  return (
    <DashboardPanel title="Success Metrics & Quality" icon="K" iconColor="bg-primary/10 text-primary">
      <div className="mb-4">
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">Key Performance Indicators</p>
        <div className="space-y-2">
          {data.kpis.map((kpi, i) => (
            <div key={i} className="rounded-lg bg-background p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">{kpi.metric}</span>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{kpi.target}</span>
              </div>
              <p className="text-xs text-foreground-muted">{kpi.measurement}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">Acceptance Criteria</p>
        <div className="space-y-2">
          {data.acceptanceCriteria.map((ac, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-success shrink-0 mt-0.5">{"\u2713"}</span>
              <div>
                <span className="font-medium text-foreground">{ac.requirement}:</span>{" "}
                <span className="text-foreground-secondary">{ac.criteria}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-accent/5 border border-accent/20 p-3 mb-4">
        <p className="text-xs font-semibold text-accent mb-1">Traceability</p>
        <p className="text-sm text-foreground-secondary">{data.traceabilityNote}</p>
      </div>

      <div>
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">Quality Gates</p>
        <div className="space-y-1">
          {data.qualityGates.map((qg, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-foreground-muted shrink-0 mt-0.5">{"\u25C6"}</span>
              <div>
                <span className="font-medium text-foreground">{qg.phase}:</span>{" "}
                <span className="text-foreground-secondary">{qg.gate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardPanel>
  );
}
