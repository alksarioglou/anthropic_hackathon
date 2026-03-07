"use client";

import { DashboardPanel } from "./DashboardPanel";
import type { ExternalData } from "@/lib/dashboard-data";

export function UserResearchPanel({ data }: { data: ExternalData["userResearch"] }) {
  return (
    <DashboardPanel title="User Research & Market" icon="U" iconColor="bg-primary/10 text-primary">
      {/* Personas */}
      <div className="mb-6">
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">User Personas</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.personas.map((p, i) => (
            <div key={i} className="rounded-lg border border-border-light bg-background p-4">
              <p className="text-sm font-semibold text-foreground">{p.name}</p>
              <p className="text-xs text-foreground-muted mb-2">{p.role}</p>
              <p className="text-xs text-foreground-secondary mb-1"><span className="font-medium text-success">Goals:</span> {p.goals}</p>
              <p className="text-xs text-foreground-secondary"><span className="font-medium text-error">Frustrations:</span> {p.frustrations}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Journey */}
      <div className="mb-6">
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">User Journey</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {data.journeyStages.map((s, i) => (
            <div key={i} className="rounded-lg bg-background p-3 min-w-[200px] flex-shrink-0">
              <p className="text-xs font-semibold text-primary mb-1">{s.stage}</p>
              <p className="text-xs text-foreground-secondary mb-1">{s.actions}</p>
              <p className="text-xs text-foreground-muted italic">{s.emotions}</p>
              <p className="text-xs text-success mt-1">{s.opportunities}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs to be Done */}
      <div className="mb-6">
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">Jobs to be Done</p>
        <ul className="space-y-1">
          {data.jobsToBeDone.map((j, i) => (
            <li key={i} className="text-sm text-foreground-secondary italic">&quot;{j}&quot;</li>
          ))}
        </ul>
      </div>

      {/* Market Research */}
      <div>
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">Competitive Landscape</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.marketResearch.map((c, i) => (
            <div key={i} className="rounded-lg border border-border-light bg-background p-3">
              <p className="text-sm font-semibold text-foreground mb-2">{c.competitor}</p>
              <p className="text-xs text-foreground-secondary"><span className="font-medium text-success">Strength:</span> {c.strength}</p>
              <p className="text-xs text-foreground-secondary mt-1"><span className="font-medium text-error">Gap:</span> {c.gap}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardPanel>
  );
}
