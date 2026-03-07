"use client";

import { ArchitectureGraph, NodeType } from "@/types/architecture";

const NODE_TYPE_META: Record<NodeType, { label: string; dot: string }> = {
  service:  { label: "Service",  dot: "bg-blue-400" },
  database: { label: "Database", dot: "bg-purple-400" },
  queue:    { label: "Queue",    dot: "bg-amber-400" },
  gateway:  { label: "Gateway",  dot: "bg-green-400" },
  external: { label: "External", dot: "bg-gray-400" },
  group:    { label: "Group",    dot: "bg-gray-300" },
};

interface Props {
  graph: ArchitectureGraph;
}

export function TechStackLegend({ graph }: Props) {
  // Collect which node types are actually used
  const usedTypes = [...new Set(graph.nodes.map((n) => n.type))] as NodeType[];

  // Build tech stack: technology → [component labels]
  const techMap = new Map<string, string[]>();
  for (const node of graph.nodes) {
    if (!node.technology) continue;
    const existing = techMap.get(node.technology) ?? [];
    existing.push(node.label);
    techMap.set(node.technology, existing);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
      {/* Node type legend */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Legend
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {usedTypes.map((type) => (
            <div key={type} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full shrink-0 ${NODE_TYPE_META[type].dot}`} />
              <span className="text-xs text-slate-600">{NODE_TYPE_META[type].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack list */}
      {techMap.size > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Tech Stack
          </p>
          <div className="space-y-1">
            {[...techMap.entries()].map(([tech, components]) => (
              <div key={tech} className="flex items-baseline gap-2 text-xs">
                <span className="font-medium text-slate-700 shrink-0">{tech}</span>
                <span className="text-slate-400 truncate">{components.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
