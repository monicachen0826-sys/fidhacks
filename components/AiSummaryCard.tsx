import { Sparkles } from "lucide-react";

export function AiSummaryCard({ text }: { text: string }) {
  return (
    <div className="card-surface border border-[#8a5cf6]/15 bg-gradient-to-br from-[#8a5cf6]/5 to-[#4f7cff]/5 p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full gradient-accent text-white">
          <Sparkles size={12} />
        </div>
        <span className="text-xs font-semibold text-foreground/70">AI Copilot</span>
      </div>
      <p className="text-[14px] leading-relaxed text-foreground/90">{text}</p>
    </div>
  );
}
