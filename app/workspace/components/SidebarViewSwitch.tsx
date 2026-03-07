"use client";

export function SidebarViewSwitch({
  active,
  onChange,
}: {
  active: "business" | "technical" | "architecture";
  onChange: (v: "business" | "technical" | "architecture") => void;
}) {
  const labels: Record<string, string> = { business: "Business", technical: "Technical", architecture: "Architecture" };
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-foreground-muted uppercase tracking-wider mb-2">View</p>
      {(["business", "technical", "architecture"] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
            active === v
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-foreground-secondary hover:text-foreground hover:bg-background-tertiary"
          }`}
        >
          {labels[v]}
        </button>
      ))}
    </div>
  );
}
