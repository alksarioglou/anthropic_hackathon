"use client";

import { StatusLog } from "./StatusLog";

interface Props {
  statusMessages: string[];
  prose: string;
  isStreaming: boolean;
}

export function ProsePanel({ statusMessages, prose, isStreaming }: Props) {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      <StatusLog messages={statusMessages} />

      {prose && (
        <div className="max-w-none">
          <p className="text-foreground-secondary leading-relaxed whitespace-pre-wrap text-sm">
            {prose}
            {isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-text-bottom" />
            )}
          </p>
        </div>
      )}

      {!prose && statusMessages.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-foreground-muted">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Researching internal knowledge base…
        </div>
      )}
    </div>
  );
}
