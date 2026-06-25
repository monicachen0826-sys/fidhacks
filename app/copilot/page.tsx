"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useLedger } from "@/lib/store";
import { COPILOT_PROMPTS, generateCopilotResponse, type CopilotPromptKey } from "@/lib/ai";
import { AiSummaryCard } from "@/components/AiSummaryCard";

export default function CopilotPage() {
  const { events } = useLedger();
  const [active, setActive] = useState<CopilotPromptKey | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handlePrompt(key: CopilotPromptKey) {
    setActive(key);
    setLoading(true);
    setResponse(null);
    window.setTimeout(() => {
      setResponse(generateCopilotResponse(key, events));
      setLoading(false);
    }, 500);
  }

  return (
    <div className="px-5 pt-6">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Growth Companion</p>
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight">AI Copilot</h1>
      </header>

      <div className="mb-5 grid grid-cols-1 gap-2.5">
        {COPILOT_PROMPTS.map((p) => (
          <button
            key={p.key}
            onClick={() => handlePrompt(p.key)}
            className={`card-surface flex items-center gap-3 p-4 text-left transition-all active:scale-[0.98] ${
              active === p.key ? "ring-2 ring-[#8a5cf6]/40" : ""
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-accent text-white">
              <Sparkles size={15} />
            </div>
            <span className="text-[14px] font-medium">{p.label}</span>
          </button>
        ))}
      </div>

      {active && (
        <div>
          {loading ? (
            <div className="card-surface flex items-center gap-2 p-4 text-sm text-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#8a5cf6]" />
              Thinking through your journey...
            </div>
          ) : response ? (
            <AiSummaryCard text={response} />
          ) : null}
        </div>
      )}
    </div>
  );
}
