"use client";

import { useEffect, useState } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Dagre from "@dagrejs/dagre";
import { ArchitectureGraph } from "@/types/architecture";
import { nodeTypes } from "./arch-nodes";

const NODE_WIDTH = 190;
const NODE_HEIGHT = 90;

function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", ranksep: 90, nodesep: 60, marginx: 40, marginy: 40 });

  nodes.forEach((node) => g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT }));
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));

  Dagre.layout(g);

  return nodes.map((node) => {
    const { x, y } = g.node(node.id);
    return { ...node, position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 } };
  });
}

interface Props {
  graph: ArchitectureGraph | null;
}

export function ArchGraph({ graph }: Props) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!graph) return;

    const rawNodes: Node[] = graph.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: { x: 0, y: 0 }, // dagre will override these
      data: {
        label: n.label,
        description: n.description,
        technology: n.technology,
      },
    }));

    const rawEdges: Edge[] = graph.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: e.animated ?? false,
      type: "smoothstep",
      style: { stroke: "#94a3b8" },
      labelStyle: { fontSize: 11, fill: "#64748b" },
      labelBgStyle: { fill: "#f8fafc", fillOpacity: 0.85 },
    }));

    setNodes(applyDagreLayout(rawNodes, rawEdges));
    setEdges(rawEdges);
  }, [graph]);

  if (!graph) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background-secondary">
        <div className="flex flex-col items-center gap-4 text-foreground-muted">
          <div className="w-full max-w-sm space-y-3 px-8">
            {[100, 80, 90, 70].map((w, i) => (
              <div
                key={i}
                className="h-10 bg-background-tertiary rounded-lg animate-pulse"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
          <p className="text-sm">Generating architecture…</p>
        </div>
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      colorMode="light"
      fitView
      fitViewOptions={{ padding: 0.2 }}
      attributionPosition="bottom-right"
      style={{ background: "#f5f5f5" }}
    >
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#d4d4d4" />
      <Controls />
    </ReactFlow>
  );
}
