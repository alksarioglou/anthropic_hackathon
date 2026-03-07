"use client";

import { useState } from "react";
import { ArchitectureGraph } from "@/types/architecture";
import { ArchGraph } from "./ArchGraph";
import { ProsePanel } from "./ProsePanel";
import { SpecsInput } from "./SpecsInput";
import { TechStackLegend } from "./TechStackLegend";

type Phase = "idle" | "loading" | "graph-ready" | "streaming" | "done" | "error";

function parseSSEBuffer(buffer: string): {
  parsed: Array<{ type: string; data: Record<string, unknown> }>;
  remainder: string;
} {
  const parsed: Array<{ type: string; data: Record<string, unknown> }> = [];
  const events = buffer.split("\n\n");
  const remainder = events.pop() ?? "";

  for (const raw of events) {
    if (!raw.trim()) continue;
    const lines = raw.split("\n");
    let type = "";
    let dataStr = "";
    for (const line of lines) {
      if (line.startsWith("event: ")) type = line.slice(7).trim();
      if (line.startsWith("data: ")) dataStr = line.slice(6).trim();
    }
    if (type && dataStr) {
      try {
        parsed.push({ type, data: JSON.parse(dataStr) });
      } catch {
        // skip malformed events
      }
    }
  }

  return { parsed, remainder };
}

export function ArchitecturePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [statusMessages, setStatusMessages] = useState<string[]>([]);
  const [graph, setGraph] = useState<ArchitectureGraph | null>(null);
  const [prose, setProse] = useState("");
  const [error, setError] = useState("");

  const startGeneration = async (specs: string) => {
    setPhase("loading");
    setStatusMessages([]);
    setGraph(null);
    setProse("");
    setError("");

    try {
      const response = await fetch("/api/generate-architecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessSpecs: specs }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const { parsed, remainder } = parseSSEBuffer(buffer);
        buffer = remainder;

        for (const event of parsed) {
          switch (event.type) {
            case "status":
              setStatusMessages((prev) => [...prev, event.data.message as string]);
              break;
            case "architecture":
              setGraph(event.data as unknown as ArchitectureGraph);
              setPhase("graph-ready");
              break;
            case "prose":
              setPhase("streaming");
              setProse((prev) => prev + (event.data.chunk as string));
              break;
            case "done":
              setPhase("done");
              break;
            case "error":
              setError(event.data.message as string);
              setPhase("error");
              break;
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setPhase("error");
    }
  };

  const reset = () => {
    setPhase("idle");
    setStatusMessages([]);
    setGraph(null);
    setProse("");
    setError("");
  };

  if (phase === "idle") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <SpecsInput onGenerate={startGeneration} />
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-slate-900">Architecture</h1>
          {phase !== "done" && (
            <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Generating
            </div>
          )}
          {phase === "done" && (
            <div className="text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
              Complete
            </div>
          )}
        </div>
        <button
          onClick={reset}
          className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          New
        </button>
      </div>

      {/* Main split panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Graph — 60% */}
        <div className="flex-[3] border-r border-slate-200">
          <ArchGraph graph={graph} />
        </div>

        {/* Prose / Status / Legend — 40% */}
        <div className="flex-[2] overflow-y-auto p-6 bg-white space-y-5">
          {graph && <TechStackLegend graph={graph} />}
          <ProsePanel
            statusMessages={statusMessages}
            prose={prose}
            isStreaming={phase === "streaming"}
          />
        </div>
      </div>
    </div>
  );
}
