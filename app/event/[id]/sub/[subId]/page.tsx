"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useLedger } from "@/lib/store";
import { Bubble } from "@/components/Bubble";
import { SignificanceDots } from "@/components/SignificanceDots";
import { AiSummaryCard } from "@/components/AiSummaryCard";
import { Badge } from "@/components/ui/badge";

export default function SubEventDetailPage() {
  const { id, subId } = useParams<{ id: string; subId: string }>();
  const router = useRouter();
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

  return (
    <div className="px-5 pt-6">
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-1 text-sm font-medium text-muted">
        <ChevronLeft size={16} /> Back to {event.title}
      </button>

      <div className="flex flex-col items-center text-center">
        <Bubble category={event.category} significance={sub.significance} className="mb-4 h-24 w-24 text-sm font-semibold">
          {sub.skillTags[0]?.slice(0, 2).toUpperCase()}
        </Bubble>
        <h1 className="text-lg font-semibold tracking-tight">{sub.title}</h1>
        <p className="mt-1 text-sm text-muted">
          {new Date(sub.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {sub.skillTags.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
      </div>

      <div className="card-surface mt-6 flex items-center justify-between p-4">
        <p className="text-sm font-medium">Significance</p>
        <SignificanceDots value={sub.significance} />
      </div>

      <div className="card-surface mt-3 p-4">
        <p className="text-sm font-medium">What happened?</p>
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
          <a href={sub.evidenceUrl} className="mt-1 block text-sm text-[#4f7cff] underline">
            {sub.evidenceUrl}
          </a>
        </div>
      )}

      {sub.aiSummary && (
        <div className="mt-3">
          <AiSummaryCard text={sub.aiSummary} />
        </div>
      )}
    </div>
  );
}
