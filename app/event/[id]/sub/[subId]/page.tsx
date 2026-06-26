"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Pencil, Star, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { useLedger } from "@/lib/store";
import { Bubble, getBubbleTone } from "@/components/Bubble";
import { AiSummaryCard } from "@/components/AiSummaryCard";

export default function SubEventDetailPage() {
  const { id, subId } = useParams<{ id: string; subId: string }>();
  const router = useRouter();
  const { getEvent, getSubEvent } = useLedger();
  const event = getEvent(id);
  const sub = getSubEvent(id, subId);

  if (!event || !sub) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 pt-20 text-center">
        <p className="text-sm text-muted">This microwin couldn&apos;t be found.</p>
      </div>
    );
  }

  const tone = getBubbleTone(event.category, event.id);

  return (
    <div className="min-h-full pb-8">
      <div className="flex items-center justify-between px-4 pt-1">
        <button type="button" onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-full text-foreground">
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-[14px] font-semibold text-foreground">Microwin Detail</h1>
        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full text-muted">
          <Pencil size={18} />
        </button>
      </div>

      <div className="px-4 pt-4 text-center">
        <Star size={16} className="mx-auto mb-2 fill-[#34d399] text-[#34d399]" />
        <h2 className="serif-heading text-lg text-foreground">{sub.title}</h2>
        <p className="mt-1 text-xs text-muted">
          {new Date(sub.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
        </p>
        <div className="mt-4 flex justify-center">
          <Bubble category={event.category} significance={Math.min(sub.significance, 3) as 1 | 2 | 3} tone={tone} />
        </div>
      </div>

      <div className="mt-6 space-y-4 px-4">
        <div className="card-surface p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">What happened?</p>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/85">{sub.description}</p>
        </div>

        {sub.whyItMattered && (
          <div className="card-surface p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Impact</p>
            <p className="mt-2 text-[13px] leading-relaxed text-foreground/85">{sub.whyItMattered}</p>
          </div>
        )}

        {sub.aiSummary && (
          <AiSummaryCard text={sub.aiSummary} tags={sub.skillTags.slice(0, 3)} />
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 px-4">
        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full glass-dark text-muted">
          <Copy size={16} />
        </button>
        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full glass-dark text-muted">
          <ThumbsUp size={16} />
        </button>
        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full glass-dark text-muted">
          <ThumbsDown size={16} />
        </button>
      </div>
    </div>
  );
}
