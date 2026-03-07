"use client";

interface Props {
  messages: string[];
}

export function StatusLog({ messages }: Props) {
  if (messages.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {messages.map((msg, i) => (
        <div
          key={i}
          className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 rounded-md px-3 py-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
          {msg}
        </div>
      ))}
    </div>
  );
}
