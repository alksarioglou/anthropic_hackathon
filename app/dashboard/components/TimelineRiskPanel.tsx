"use client";

import { DashboardPanel } from "./DashboardPanel";
import type { SharedData } from "@/lib/dashboard-data";

const STATUS_COLORS = {
  completed: "bg-success text-white",
  "in-progress": "bg-primary text-white",
  upcoming: "bg-foreground-muted/20 text-foreground-muted",
};

const LIKELIHOOD_COLORS = { low: "text-success", medium: "text-warning", high: "text-error" };
const IMPACT_COLORS = { low: "text-success", medium: "text-warning", high: "text-error" };

export function TimelineRiskPanel({ data }: { data: SharedData["timeline"] }) {
  return (
    <DashboardPanel title="Timeline & Risk" icon="!" iconColor="bg-warning/10 text-warning">
      {/* Milestones */}
      <div className="mb-6">
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-3">Milestones</p>
        <div className="space-y-2">
          {data.milestones.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[m.status]}`}>
                {m.date}
              </span>
              <span className="text-sm text-foreground">{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Register */}
      <div className="mb-4">
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">Risk Register</p>
        <div className="space-y-2">
          {data.riskRegister.map((r, i) => (
            <div key={i} className="rounded-lg bg-background p-3">
              <p className="text-sm font-medium text-foreground mb-1">{r.risk}</p>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs">
                  Likelihood: <span className={`font-semibold ${LIKELIHOOD_COLORS[r.likelihood]}`}>{r.likelihood}</span>
                </span>
                <span className="text-xs">
                  Impact: <span className={`font-semibold ${IMPACT_COLORS[r.impact]}`}>{r.impact}</span>
                </span>
              </div>
              <p className="text-xs text-foreground-muted">Mitigation: {r.mitigation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Assumptions & Constraints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">Assumptions</p>
          <ul className="space-y-1">
            {data.assumptions.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
                <span className="text-foreground-muted shrink-0 mt-0.5">{"\u2022"}</span>{a}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">Constraints</p>
          <ul className="space-y-1">
            {data.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
                <span className="text-error shrink-0 mt-0.5">{"\u2022"}</span>{c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardPanel>
  );
}
