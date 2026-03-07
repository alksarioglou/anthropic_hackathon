"use client";

// Stage 1 — Onboarding

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProjectMode, DashboardStyle } from "@/types";

const SAMPLE_IDEAS = [
  "A small internal web app where a team can create tasks, assign owners, set due dates, track status, and get reminders.",
  "An internal portal where employees can report IT incidents, support teams can triage and resolve them, and important fixes become tracked change requests with approvals.",
  "A customer-facing SaaS tool that lets marketing teams plan, schedule, and analyze social media campaigns across platforms.",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [mode, setMode] = useState<ProjectMode>("internal");
  const [dashboardStyle, setDashboardStyle] =
    useState<DashboardStyle>("technical");
  const [isLoading, setIsLoading] = useState(false);

  function handleSampleIdea(sample: string) {
    setIdea(sample);
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsLoading(true);

    // Store onboarding data in sessionStorage for the workspace page
    const project = {
      id: `proj_${Date.now()}`,
      name: idea.slice(0, 60) + (idea.length > 60 ? "…" : ""),
      idea: idea.trim(),
      mode,
      dashboardStyle,
      createdAt: Date.now(),
    };
    sessionStorage.setItem("sdlc_project", JSON.stringify(project));
    sessionStorage.removeItem("sdlc_artifacts");

    router.push("/workspace");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 px-8 py-4 flex items-center gap-3">
        <div className="w-7 h-7 rounded-md bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
          S
        </div>
        <span className="font-semibold text-zinc-100">SDLC Planner</span>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-zinc-50 mb-2">
            Describe your software idea
          </h1>
          <p className="text-zinc-400 mb-8">
            Tell us what you want to build. Our AI pipeline will generate a
            complete SDLC plan — vision, requirements, architecture, backlog,
            and tests.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Idea textarea */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Your idea
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="We need a small internal web app where a team can create tasks, assign owners, set due dates, track status..."
                className="w-full h-32 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                required
              />
              {/* Sample ideas */}
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs text-zinc-600">Try:</span>
                {SAMPLE_IDEAS.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSampleIdea(sample)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                  >
                    Sample {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode selection */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Project mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    {
                      value: "internal",
                      label: "Internal / On-Premise",
                      desc: "Connects to internal tools and databases",
                    },
                    {
                      value: "external",
                      label: "External / Cloud",
                      desc: "Runs competitive analysis against public sources",
                    },
                  ] as const
                ).map(({ value, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMode(value)}
                    className={`text-left px-4 py-3 rounded-xl border transition-colors ${
                      mode === value
                        ? "border-indigo-500 bg-indigo-500/10 text-zinc-100"
                        : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard style */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Default view
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    {
                      value: "business",
                      label: "Business Dashboard",
                      desc: "Vision, Requirements, Cost, Competitive Analysis",
                    },
                    {
                      value: "technical",
                      label: "Technical Dashboard",
                      desc: "Architecture, Frameworks, Backlog, Tests",
                    },
                  ] as const
                ).map(({ value, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDashboardStyle(value)}
                    className={`text-left px-4 py-3 rounded-xl border transition-colors ${
                      dashboardStyle === value
                        ? "border-indigo-500 bg-indigo-500/10 text-zinc-100"
                        : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !idea.trim()}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold transition-colors"
            >
              {isLoading ? "Starting pipeline…" : "Generate SDLC Plan"}
            </button>
          </form>
        </div>
      </main>

    </div>
  );
}
