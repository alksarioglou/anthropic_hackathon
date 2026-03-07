"use client";

import ReactMarkdown from "react-markdown";
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
        <div className="md-content text-sm text-foreground-secondary">
          {isStreaming ? (
            <pre className="whitespace-pre-wrap font-sans leading-relaxed">
              {prose}
              <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-text-bottom" />
            </pre>
          ) : (
            <ReactMarkdown>{prose}</ReactMarkdown>
          )}
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
