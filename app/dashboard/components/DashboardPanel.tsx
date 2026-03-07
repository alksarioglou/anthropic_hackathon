"use client";

import { useState } from "react";

interface DashboardPanelProps {
  title: string;
  icon: string;
  iconColor: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function DashboardPanel({
  title,
  icon,
  iconColor,
  children,
  defaultOpen = true,
}: DashboardPanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-border bg-card-bg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-background-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${iconColor}`}
          >
            {icon}
          </span>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
        </div>
        <span className="text-foreground-muted text-sm">
          {open ? "\u25B2" : "\u25BC"}
        </span>
      </button>
      {open && <div className="px-5 pb-5 pt-0">{children}</div>}
    </div>
  );
}
