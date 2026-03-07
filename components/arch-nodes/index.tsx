"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { NodeType } from "@/types/architecture";

interface NodeData {
  label: string;
  description?: string;
  technology?: string;
  [key: string]: unknown;
}

const baseNode = (
  color: { border: string; bg: string; title: string; tech: string; desc: string },
  data: NodeData
) => (
  <div
    className={`rounded-lg border-2 ${color.border} ${color.bg} px-4 py-3 min-w-[130px] max-w-[200px] shadow-md`}
  >
    <Handle type="target" position={Position.Top} className="!bg-gray-400" />
    {data.technology && (
      <div className={`text-[10px] font-bold uppercase tracking-wider ${color.tech} mb-0.5`}>
        {data.technology}
      </div>
    )}
    <div className={`text-sm font-semibold ${color.title} leading-tight`}>{data.label}</div>
    {data.description && (
      <div className={`text-[11px] ${color.desc} mt-1 leading-snug`}>{data.description}</div>
    )}
    <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
  </div>
);

export function ServiceNode({ data }: NodeProps) {
  return baseNode(
    {
      border: "border-blue-400",
      bg: "bg-blue-50",
      title: "text-blue-900",
      tech: "text-blue-500",
      desc: "text-blue-600",
    },
    data as NodeData
  );
}

export function DatabaseNode({ data }: NodeProps) {
  return baseNode(
    {
      border: "border-purple-400",
      bg: "bg-purple-50",
      title: "text-purple-900",
      tech: "text-purple-500",
      desc: "text-purple-600",
    },
    data as NodeData
  );
}

export function QueueNode({ data }: NodeProps) {
  return baseNode(
    {
      border: "border-amber-400",
      bg: "bg-amber-50",
      title: "text-amber-900",
      tech: "text-amber-500",
      desc: "text-amber-600",
    },
    data as NodeData
  );
}

export function GatewayNode({ data }: NodeProps) {
  return baseNode(
    {
      border: "border-green-400",
      bg: "bg-green-50",
      title: "text-green-900",
      tech: "text-green-500",
      desc: "text-green-600",
    },
    data as NodeData
  );
}

export function ExternalNode({ data }: NodeProps) {
  return baseNode(
    {
      border: "border-gray-400",
      bg: "bg-gray-50",
      title: "text-gray-800",
      tech: "text-gray-500",
      desc: "text-gray-500",
    },
    data as NodeData
  );
}

export function GroupNode({ data }: NodeProps) {
  const d = data as NodeData;
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 px-4 py-3 min-w-[150px] min-h-[80px]">
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {d.label}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
}

export const nodeTypes: Record<NodeType, React.ComponentType<NodeProps>> = {
  service: ServiceNode,
  database: DatabaseNode,
  queue: QueueNode,
  gateway: GatewayNode,
  external: ExternalNode,
  group: GroupNode,
};
