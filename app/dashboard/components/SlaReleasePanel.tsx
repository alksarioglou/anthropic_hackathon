"use client";

import { DashboardPanel } from "./DashboardPanel";
import type { ExternalData } from "@/lib/dashboard-data";

export function SlaReleasePanel({ data }: { data: ExternalData["slaAndRelease"] }) {
  return (
    <DashboardPanel title="SLA & Release" icon="S" iconColor="bg-warning/10 text-warning" defaultOpen={false}>
      <div className="mb-4">
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">SLA Definitions</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-2 pr-4 text-xs text-foreground-muted font-medium">Metric</th>
                <th className="text-left py-2 pr-4 text-xs text-foreground-muted font-medium">Target</th>
                <th className="text-left py-2 text-xs text-foreground-muted font-medium">Penalty</th>
              </tr>
            </thead>
            <tbody>
              {data.slaDefinitions.map((sla, i) => (
                <tr key={i} className="border-b border-border-light last:border-0">
                  <td className="py-2 pr-4 text-foreground font-medium">{sla.metric}</td>
                  <td className="py-2 pr-4 text-primary font-semibold text-xs">{sla.target}</td>
                  <td className="py-2 text-foreground-secondary text-xs">{sla.penalty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg bg-background p-3">
        <p className="text-xs font-medium text-foreground-muted mb-1">Release Notes (v1.0)</p>
        <p className="text-sm text-foreground-secondary">{data.releaseNotes}</p>
      </div>
    </DashboardPanel>
  );
}
