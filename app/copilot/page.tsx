"use client";

import { useMemo } from "react";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, BarChart3, FileText, Link2, MessageCircle } from "lucide-react";
import { useLedger } from "@/lib/store";
import { useOnboarding } from "@/lib/onboarding-store";
import { sortCopilotPrompts } from "@/lib/personalization";
import { COPILOT_PROMPTS, generateCopilotResponse, type CopilotPromptKey } from "@/lib/ai";
import { AppHeader } from "@/components/AppHeader";
import { cn } from "@/lib/utils";

const PROMPT_ICONS: Record<CopilotPromptKey, React.ComponentType<{ size?: number }>> = {
  "summarize-growth": BarChart3,
  "strongest-skills": Sparkles,
  "resume-language": FileText,
  "connect-growth": Link2,
  reflect: MessageCircle,
};

export default function CopilotPage() {
  const { events } = useLedger();
  const { goals } = useOnboarding();
  const sortedPrompts = useMemo(() => sortCopilotPrompts(COPILOT_PROMPTS, goals), [goals]);
  const [messages, setMessages] = useState<{ id: string; role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  function sendMessage(text: string, key?: CopilotPromptKey) {
    if (!text.trim()) return;
    setMessages((p) => [...p, { id: `u-${Date.now()}`, role: "user", text: text.trim() }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((p) => [...p, { id: `a-${Date.now()}`, role: "assistant", text: generateCopilotResponse(key ?? "reflect", events) }]);
      setLoading(false);
    }, 600);
  }

  return (
    <div className="flex min-h-full flex-col pb-20">
      <AppHeader title="Copilot" showMenu={false} />
      <div className="flex flex-1 flex-col px-4">
        <p className="mb-4 text-sm text-muted">Hi there! 👋 Ask me anything about your journey.</p>

        {messages.length === 0 && (
          <div className="mb-4 grid gap-2">
            {sortedPrompts.slice(0, 4).map((p) => {
              const Icon = PROMPT_ICONS[p.key];
              return (
                <button key={p.key} type="button" onClick={() => sendMessage(p.label, p.key)} className="card-surface flex items-center gap-3 p-3 text-left">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-accent text-white"><Icon size={16} /></div>
                  <span className="text-[13px] font-semibold">{p.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex-1 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-[13px]", m.role === "user" ? "ml-auto gradient-accent text-white" : "card-surface")}>
              {m.text}
            </div>
          ))}
          {loading && <div className="card-surface px-4 py-3 text-sm text-muted">Thinking...</div>}
          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="sticky bottom-16 mx-4 flex items-center gap-2 rounded-full glass-dark py-1.5 pl-4 pr-1.5">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about your journey..." className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted" />
        <button type="submit" disabled={!input.trim()} className="flex h-8 w-8 items-center justify-center rounded-full gradient-accent text-white disabled:opacity-40"><Send size={14} /></button>
      </form>
    </div>
  );
}
