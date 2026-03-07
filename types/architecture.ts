export type NodeType =
  | "service"
  | "database"
  | "queue"
  | "gateway"
  | "external"
  | "group";

export interface ArchNode {
  id: string;
  type: NodeType;
  label: string;
  description?: string;
  technology?: string;
  position: { x: number; y: number };
}

export interface ArchEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface ArchitectureGraph {
  nodes: ArchNode[];
  edges: ArchEdge[];
}

export type SSEEventType = "status" | "architecture" | "prose" | "done" | "error";

export interface SSEEvent {
  type: SSEEventType;
  data: Record<string, unknown>;
}
