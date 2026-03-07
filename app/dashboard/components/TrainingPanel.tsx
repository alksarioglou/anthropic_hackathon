"use client";

import { DashboardPanel } from "./DashboardPanel";

interface TrainingData {
  approach: string;
  phases: { phase: string; audience: string; method: string }[];
}

export function TrainingPanel({ data, context }: { data: TrainingData; context: "internal" | "external" }) {
  return (
    <DashboardPanel
      title={context === "internal" ? "Internal Training Plan" : "Client Training Plan"}
      icon="L"
      iconColor="bg-accent/10 text-accent"
      defaultOpen={false}
    >
      <p className="text-sm text-foreground-secondary mb-4">{data.approach}</p>
      <div className="space-y-2">
        {data.phases.map((p, i) => (
          <div key={i} className="rounded-lg bg-background p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">{p.phase}</span>
              <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{p.audience}</span>
            </div>
            <p className="text-xs text-foreground-secondary">{p.method}</p>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}
