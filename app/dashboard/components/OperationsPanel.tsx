"use client";

import { DashboardPanel } from "./DashboardPanel";
import type { SharedData } from "@/lib/dashboard-data";

export function OperationsPanel({ data }: { data: SharedData["operations"]; glossary: SharedData["glossary"] }) {
  return (
    <DashboardPanel title="Deployment & Operations" icon="R" iconColor="bg-accent/10 text-accent" defaultOpen={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-background p-3">
          <p className="text-xs font-medium text-foreground-muted mb-1">Deployment Strategy</p>
          <p className="text-sm text-foreground-secondary">{data.deploymentStrategy}</p>
        </div>
        <div className="rounded-lg bg-background p-3">
          <p className="text-xs font-medium text-foreground-muted mb-1">Monitoring Plan</p>
          <p className="text-sm text-foreground-secondary">{data.monitoringPlan}</p>
        </div>
        <div className="rounded-lg bg-background p-3">
          <p className="text-xs font-medium text-foreground-muted mb-1">Feedback Mechanism</p>
          <p className="text-sm text-foreground-secondary">{data.feedbackMechanism}</p>
        </div>
        <div className="rounded-lg bg-background p-3">
          <p className="text-xs font-medium text-foreground-muted mb-1">Definition of Done</p>
          <ul className="space-y-1">
            {data.definitionOfDone.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
                <span className="text-success shrink-0 mt-0.5">{"\u2713"}</span>{d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardPanel>
  );
}
