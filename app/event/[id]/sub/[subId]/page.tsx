"use client";

import { useParams } from "next/navigation";
import { CheckCircle2, Pencil, Share2, Bookmark, Trash2, ImageIcon } from "lucide-react";
import { useLedger } from "@/lib/store";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SignificanceDots } from "@/components/SignificanceDots";
import { AiSummaryCard } from "@/components/AiSummaryCard";
import { Badge } from "@/components/ui/badge";

export default function SubEventDetailPage() {
  const { id, subId } = useParams<{ id: string; subId: string }>();
  const { getEvent, getSubEvent } = useLedger();
  const event = getEvent(id);
  const sub = getSubEvent(id, subId);

  if (!event || !sub) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 pt-20 text-center">
        <p className="text-sm text-muted">This micro-win couldn&apos;t be found.</p>
      </div>
    );
  }

  const handleShare = () => {
    const summary = `${sub.title} (${event.title}) — ${sub.description}`;
    navigator.clipboard?.writeText(summary);
  };

  return (
    <div className="px-5 pt-6">
      <ScreenHeader
        title={sub.title}
        subtitle={`Micro-win in ${event.title}`}
        showBack
        right={
          <button
            aria-label="Edit micro-win"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-foreground"
          >
            <Pencil size={15} />
          </button>
        }
      />

      <div className="card-surface flex items-start justify-between p-4">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 size={22} className="shrink-0 text-emerald-500" />
          <div>
            <p className="text-[14px] font-medium leading-tight">
              {new Date(sub.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <span className="mt-1 inline-block rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
              Milestone
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Impact</p>
          <SignificanceDots value={sub.significance} size="sm" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {sub.skillTags.map((s) => (
          <Badge key={s}>{s}</Badge>
        ))}
      </div>

      <div className="card-surface mt-3 p-4">
        <p className="text-sm font-medium">What happened</p>
        <p className="mt-1 text-[14px] leading-relaxed text-foreground/90">{sub.description}</p>
      </div>

      {sub.whyItMattered && (
        <div className="card-surface mt-3 p-4">
          <p className="text-sm font-medium">Why did it matter?</p>
          <p className="mt-1 text-[14px] leading-relaxed text-foreground/90">{sub.whyItMattered}</p>
        </div>
      )}

      {sub.evidenceUrl && (
        <div className="card-surface mt-3 p-4">
          <p className="text-sm font-medium">Evidence</p>
          <a href={sub.evidenceUrl} className="mt-2 flex items-center gap-3 rounded-xl bg-black/5 p-2.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg gradient-accent text-white">
              <ImageIcon size={18} />
            </div>
            <span className="truncate text-[13px] font-medium">{sub.evidenceUrl.split("/").pop()}</span>
          </a>
        </div>
      )}

      {sub.aiSummary && (
        <div className="mt-3">
          <div className="mb-1.5 flex items-center gap-1.5">
            <p className="text-sm font-medium">Copilot Summary</p>
            <span className="rounded-full bg-[#8a5cf6]/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#8a5cf6]">
              Beta
            </span>
          </div>
          <AiSummaryCard text={sub.aiSummary} />
        </div>
      )}

      <div className="mt-5 flex items-center justify-center gap-6 pb-4">
        <button onClick={handleShare} aria-label="Share" className="flex flex-col items-center gap-1 text-muted">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
            <Share2 size={16} />
          </div>
          <span className="text-[10px] font-medium">Share</span>
        </button>
        <button aria-label="Bookmark" className="flex flex-col items-center gap-1 text-muted">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
            <Bookmark size={16} />
          </div>
          <span className="text-[10px] font-medium">Save</span>
        </button>
        <button aria-label="Delete" className="flex flex-col items-center gap-1 text-muted">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
            <Trash2 size={16} />
          </div>
          <span className="text-[10px] font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
}
