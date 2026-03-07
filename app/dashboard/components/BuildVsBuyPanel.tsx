"use client";

import { DashboardPanel } from "./DashboardPanel";
import type { InternalData } from "@/lib/dashboard-data";

export function BuildVsBuyPanel({ data }: { data: InternalData["buildVsBuy"] }) {
  return (
    <DashboardPanel title="Build vs Buy Analysis" icon="B" iconColor="bg-primary/10 text-primary">
      <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 mb-4">
        <p className="text-xs font-semibold text-primary mb-1">Recommendation</p>
        <p className="text-sm text-foreground-secondary">{data.recommendation}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {data.options.map((opt, i) => (
          <div key={i} className="rounded-lg border border-border-light bg-background p-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">{opt.option}</h3>
            <p className="text-xs text-foreground-muted mb-3">{opt.costEstimate}</p>
            <div className="mb-2">
              <p className="text-xs font-medium text-success mb-1">Pros</p>
              <ul className="space-y-0.5">
                {opt.pros.map((p, j) => (
                  <li key={j} className="text-xs text-foreground-secondary flex items-start gap-1">
                    <span className="text-success shrink-0">+</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-error mb-1">Cons</p>
              <ul className="space-y-0.5">
                {opt.cons.map((c, j) => (
                  <li key={j} className="text-xs text-foreground-secondary flex items-start gap-1">
                    <span className="text-error shrink-0">-</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}
