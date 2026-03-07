"use client";

import { ArchitectureGraph, NodeType } from "@/types/architecture";

const NODE_TYPE_META: Record<NodeType, { label: string; dot: string; bg: string }> = {
  gateway:  { label: "Gateway",  dot: "bg-green-400",  bg: "bg-green-50" },
  service:  { label: "Service",  dot: "bg-blue-400",   bg: "bg-blue-50" },
  database: { label: "Database", dot: "bg-purple-400", bg: "bg-purple-50" },
  queue:    { label: "Queue",    dot: "bg-amber-400",  bg: "bg-amber-50" },
  external: { label: "External", dot: "bg-gray-400",   bg: "bg-gray-50" },
  group:    { label: "Group",    dot: "bg-gray-300",   bg: "bg-gray-50" },
};

interface Props {
  graph: ArchitectureGraph;
}

export function TechStackLegend({ graph }: Props) {
  // Group nodes by type, only types that are actually used
  const byType = new Map<NodeType, { label: string; technology?: string }[]>();
  for (const node of graph.nodes) {
    const list = byType.get(node.type) ?? [];
    list.push({ label: node.label, technology: node.technology });
    byType.set(node.type, list);
  }

  // Order: gateway, service, database, queue, external, group
  const typeOrder: NodeType[] = ["gateway", "service", "database", "queue", "external", "group"];
  const sortedTypes = typeOrder.filter((t) => byType.has(t));

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Components
      </p>
      <div className="space-y-2.5">
        {sortedTypes.map((type) => {
          const meta = NODE_TYPE_META[type];
          const nodes = byType.get(type)!;
          return (
            <div key={type}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full shrink-0 ${meta.dot}`} />
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {meta.label}s
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 ml-3.5">
                {nodes.map((n, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${meta.bg} text-slate-700`}
                  >
                    <span className="font-medium">{n.label}</span>
                    {n.technology && (
                      <span className="text-slate-400 text-[10px]">({n.technology})</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
