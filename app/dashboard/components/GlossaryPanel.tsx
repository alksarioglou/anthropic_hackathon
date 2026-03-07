"use client";

import { DashboardPanel } from "./DashboardPanel";
import type { SharedData } from "@/lib/dashboard-data";

export function GlossaryPanel({ data }: { data: SharedData["glossary"] }) {
  return (
    <DashboardPanel title="Glossary" icon="G" iconColor="bg-foreground-muted/10 text-foreground-muted" defaultOpen={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {data.map((item, i) => (
          <div key={i} className="rounded-lg bg-background p-3">
            <p className="text-sm font-medium text-foreground">{item.term}</p>
            <p className="text-xs text-foreground-secondary mt-0.5">{item.definition}</p>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}
