"use client";

import { useState } from "react";

const EXAMPLE_SPEC =
  "We need an internal web app where employees can report IT incidents, support teams can triage and resolve them, and important fixes can become tracked change requests with approvals and implementation planning.";

interface Props {
  onGenerate: (specs: string) => void;
  disabled?: boolean;
}

export function SpecsInput({ onGenerate, disabled }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const text = value.trim() || EXAMPLE_SPEC;
    onGenerate(text);
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Architecture Generator</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Describe your system in plain language. The agent will research Swiss Life&apos;s internal
          knowledge base and design a compliant architecture.
        </p>
      </div>

      <textarea
        className="w-full h-40 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none shadow-sm"
        placeholder={EXAMPLE_SPEC}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />

      <button
        onClick={handleSubmit}
        disabled={disabled}
        className="self-end px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
      >
        Generate Architecture
      </button>
    </div>
  );
}
