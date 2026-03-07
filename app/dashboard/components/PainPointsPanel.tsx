"use client";

import { DashboardPanel } from "./DashboardPanel";
import type { InternalData } from "@/lib/dashboard-data";

export function PainPointsPanel({ data }: { data: InternalData["painPoints"] }) {
  return (
    <DashboardPanel title="Pain Point Documentation" icon="!" iconColor="bg-error/10 text-error">
      <div className="space-y-3">
        {data.map((p, i) => (
          <div key={i} className="rounded-lg bg-background p-4">
            <p className="text-sm font-semibold text-foreground mb-1">{p.who}</p>
            <p className="text-sm text-foreground-secondary mb-2">{p.problem}</p>
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-error bg-error/10 px-2 py-0.5 rounded-full shrink-0">Impact</span>
              <p className="text-xs text-foreground-muted">{p.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}
