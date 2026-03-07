"use client";

import { DashboardPanel } from "./DashboardPanel";
import type { SharedData } from "@/lib/dashboard-data";

export function StakeholdersPanel({ data }: { data: SharedData["stakeholders"] }) {
  return (
    <DashboardPanel title="Stakeholders & Team" icon="T" iconColor="bg-accent/10 text-accent" defaultOpen={false}>
      <div className="mb-4">
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">Stakeholder Map</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-2 pr-4 text-xs text-foreground-muted font-medium">Role</th>
                <th className="text-left py-2 pr-4 text-xs text-foreground-muted font-medium">Owner</th>
                <th className="text-left py-2 text-xs text-foreground-muted font-medium">Responsibility</th>
              </tr>
            </thead>
            <tbody>
              {data.map.map((s, i) => (
                <tr key={i} className="border-b border-border-light last:border-0">
                  <td className="py-2 pr-4 text-foreground font-medium">{s.role}</td>
                  <td className="py-2 pr-4 text-foreground-secondary">{s.name}</td>
                  <td className="py-2 text-foreground-secondary">{s.responsibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide mb-2">RACI Matrix</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-2 pr-3 text-xs text-foreground-muted font-medium">Task</th>
                <th className="text-left py-2 pr-3 text-xs text-foreground-muted font-medium">R</th>
                <th className="text-left py-2 pr-3 text-xs text-foreground-muted font-medium">A</th>
                <th className="text-left py-2 pr-3 text-xs text-foreground-muted font-medium">C</th>
                <th className="text-left py-2 text-xs text-foreground-muted font-medium">I</th>
              </tr>
            </thead>
            <tbody>
              {data.raci.map((r, i) => (
                <tr key={i} className="border-b border-border-light last:border-0">
                  <td className="py-2 pr-3 text-foreground font-medium">{r.task}</td>
                  <td className="py-2 pr-3 text-foreground-secondary text-xs">{r.responsible}</td>
                  <td className="py-2 pr-3 text-foreground-secondary text-xs">{r.accountable}</td>
                  <td className="py-2 pr-3 text-foreground-secondary text-xs">{r.consulted}</td>
                  <td className="py-2 text-foreground-secondary text-xs">{r.informed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg bg-background p-3">
          <p className="text-xs font-medium text-foreground-muted mb-1">Communication Plan</p>
          <p className="text-sm text-foreground-secondary">{data.communicationPlan}</p>
        </div>
        <div className="rounded-lg bg-background p-3">
          <p className="text-xs font-medium text-foreground-muted mb-1">Escalation Paths</p>
          <p className="text-sm text-foreground-secondary">{data.escalationPaths}</p>
        </div>
      </div>
    </DashboardPanel>
  );
}
