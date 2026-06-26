"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLedger } from "@/lib/store";
import { COPILOT_PROMPTS, generateCopilotResponse, routeFreeTextPrompt, type CopilotPromptKey } from "@/lib/ai";
import { AiSummaryCard } from "@/components/AiSummaryCard";

export default function CopilotPage() {
  const { events } = useLedger();
  const [active, setActive] = useState<CopilotPromptKey | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  function runPrompt(key: CopilotPromptKey) {
    setActive(key);
    setLoading(true);
    setResponse(null);
    window.setTimeout(() => {
      setResponse(generateCopilotResponse(key, events));
      setLoading(false);
    }, 500);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    runPrompt(routeFreeTextPrompt(trimmed));
    setInput("");
  }

  const activePrompt = active ? COPILOT_PROMPTS.find((p) => p.key === active) : null;

  return (
    <div className="flex h-full flex-col px-5 pt-6">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">AI Copilot</p>
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight">
          {activePrompt ? activePrompt.title : "Hi! 👋 What would you like to explore?"}
        </h1>
        <p className="mt-1 text-xs text-muted">Powered by {events.length} documented events</p>
      </header>

      <div className="flex-1 overflow-y-auto pb-28">
        <div className="mb-5 flex gap-2 overflow-x-auto whitespace-nowrap pb-1">
          {COPILOT_PROMPTS.map((p) => (
            <button
              key={p.key}
              onClick={() => runPrompt(p.key)}
              className={`card-surface flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-left transition-all active:scale-[0.98] ${
                active === p.key ? "ring-2 ring-[#8a5cf6]/40" : ""
              }`}
            >
              <span className="text-sm">{p.emoji}</span>
              <span className="text-[13px] font-medium">{p.label}</span>
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

      <div className="fixed inset-x-0 bottom-24 z-30 flex justify-center px-5">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-full border border-border bg-surface/95 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Ask anything about your journey..."
            className="flex-1 bg-transparent px-3 text-[14px] outline-none"
          />
          <button
            onClick={handleSend}
            aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-accent text-white"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
