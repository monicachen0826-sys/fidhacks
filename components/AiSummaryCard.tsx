import { Sparkles } from "lucide-react";

export function AiSummaryCard({ text, tags }: { text: string; tags?: string[] }) {
  return (
    <div className="card-surface relative overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7c3aed]/10 to-transparent" />
      <div className="relative">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full gradient-accent text-white">
            <Sparkles size={11} />
          </div>
          <span className="text-xs font-semibold text-foreground">AI Copilot Summary</span>
          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">Beta</span>
        </div>
        <p className="text-[13px] leading-relaxed text-foreground/85">{text}</p>
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-medium text-muted">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
