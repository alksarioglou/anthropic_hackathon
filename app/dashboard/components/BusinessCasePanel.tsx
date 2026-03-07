"use client";

import { DashboardPanel } from "./DashboardPanel";
import type { SharedData } from "@/lib/dashboard-data";

export function BusinessCasePanel({ data }: { data: SharedData["businessCase"] }) {
  return (
    <DashboardPanel title="Business Case & ROI" icon="$" iconColor="bg-success/10 text-success">
      <p className="text-sm text-foreground-secondary mb-4">{data.summary}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {data.costBenefitItems.map((item, i) => (
          <div key={i} className="rounded-lg bg-background p-3">
            <p className="text-xs text-foreground-muted">{item.label}</p>
            <p className="text-sm font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 mb-4">
        <p className="text-xs font-semibold text-primary mb-1">ROI Projection</p>
        <p className="text-sm text-foreground-secondary">{data.roiProjection}</p>
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">Go / No-Go Criteria</p>
        <ul className="space-y-1">
          {data.goNoGoCriteria.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
              <span className="text-success shrink-0 mt-0.5">{"\u2713"}</span>{c}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">Budget Allocation</p>
        <div className="space-y-2">
          {data.budgetAllocation.map((b, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-foreground-secondary">{b.category}</span>
                <span className="text-xs text-foreground-muted">{b.amount}</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${b.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardPanel>
  );
}
