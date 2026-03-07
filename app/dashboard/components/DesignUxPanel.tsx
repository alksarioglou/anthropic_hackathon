"use client";

import { DashboardPanel } from "./DashboardPanel";
import type { ExternalData } from "@/lib/dashboard-data";

export function DesignUxPanel({ data }: { data: ExternalData["designUx"] }) {
  return (
    <DashboardPanel title="Design, Accessibility & Localization" icon="D" iconColor="bg-accent/10 text-accent" defaultOpen={false}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-lg bg-background p-3">
          <p className="text-xs font-medium text-foreground-muted mb-1">Wireframes & Prototypes</p>
          <p className="text-sm text-foreground-secondary">{data.wireframeStatus}</p>
        </div>
        <div className="rounded-lg bg-background p-3">
          <p className="text-xs font-medium text-foreground-muted mb-1">Accessibility</p>
          <ul className="space-y-0.5">
            {data.accessibilityRequirements.map((a, i) => (
              <li key={i} className="text-xs text-foreground-secondary flex items-start gap-1">
                <span className="text-success shrink-0">{"\u2713"}</span>{a}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-background p-3">
          <p className="text-xs font-medium text-foreground-muted mb-1">Languages</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {data.localizationLanguages.map((lang, i) => (
              <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{lang}</span>
            ))}
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
}
