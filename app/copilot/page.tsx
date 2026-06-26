"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, BarChart3, FileText, Link2, MessageCircle } from "lucide-react";
import { useLedger } from "@/lib/store";
import { COPILOT_PROMPTS, generateCopilotResponse, type CopilotPromptKey } from "@/lib/ai";
import { AppHeader } from "@/components/AppHeader";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const PROMPT_ICONS: Record<CopilotPromptKey, React.ComponentType<{ size?: number }>> = {
  "summarize-growth": BarChart3,
  "strongest-skills": Sparkles,
  "resume-language": FileText,
  "connect-growth": Link2,
  reflect: MessageCircle,
};

export default function CopilotPage() {
  const { events } = useLedger();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function sendMessage(text: string, promptKey?: CopilotPromptKey) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    window.setTimeout(() => {
      const response = promptKey
        ? generateCopilotResponse(promptKey, events)
        : generateCopilotResponse("reflect", events);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: response },
      ]);
      setLoading(false);
    }, 600);
  }

  function handlePrompt(key: CopilotPromptKey) {
    const prompt = COPILOT_PROMPTS.find((p) => p.key === key);
    if (prompt) sendMessage(prompt.label, key);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      <AppHeader title="Copilot" showMenu={false} />

      <div className="flex flex-1 flex-col px-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight">AI Copilot</h2>
          <p className="mt-1 text-sm text-muted">
            Hi there! 👋 Ask me anything about your journey.
          </p>
        </div>

        {messages.length === 0 && (
          <div className="mb-4 grid gap-2.5">
            {COPILOT_PROMPTS.slice(0, 4).map((p) => {
              const Icon = PROMPT_ICONS[p.key];
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handlePrompt(p.key)}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm transition-transform active:scale-[0.98]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-accent text-white">
                    <Icon size={18} />
                  </div>
                  <span className="text-[14px] font-semibold">{p.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex-1 space-y-3 pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed",
                msg.role === "user"
                  ? "ml-auto bg-accent text-white"
                  : "bg-white shadow-sm"
              )}
            >
              {msg.role === "assistant" && (
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-accent" />
                  <span className="text-[11px] font-semibold text-accent">Copilot</span>
                </div>
              )}
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-muted shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              Thinking through your journey...
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 z-30 mx-auto max-w-md px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2 rounded-full border border-border bg-white py-1.5 pl-4 pr-1.5 shadow-lg"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your journey..."
            className="flex-1 bg-transparent py-2 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white disabled:opacity-40"
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
