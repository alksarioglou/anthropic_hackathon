"use client";

import { DashboardPanel } from "./DashboardPanel";
import type { ExternalData } from "@/lib/dashboard-data";

export function CompliancePanel({ data }: { data: ExternalData["compliance"] }) {
  return (
    <DashboardPanel title="Compliance, Privacy & Licensing" icon="C" iconColor="bg-error/10 text-error">
      <div className="mb-4">
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">Regulatory Requirements</p>
        <div className="space-y-2">
          {data.regulations.map((r, i) => (
            <div key={i} className="rounded-lg bg-background p-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">{r.name}</p>
                <p className="text-xs text-foreground-secondary mt-0.5">{r.requirement}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 font-medium ${
                r.status === "Aligned" ? "bg-success/10 text-success" :
                r.status === "Framework in place" ? "bg-accent/10 text-accent" :
                "bg-warning/10 text-warning"
              }`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-error/5 border border-error/20 p-3 mb-4">
        <p className="text-xs font-semibold text-error mb-1">Data Privacy Impact Assessment</p>
        <p className="text-sm text-foreground-secondary">{data.privacyAssessment}</p>
      </div>

      <div className="rounded-lg bg-background p-3">
        <p className="text-xs font-medium text-foreground-muted mb-1">Licensing & IP</p>
        <p className="text-sm text-foreground-secondary">{data.licensingConsiderations}</p>
      </div>
    </DashboardPanel>
  );
}
