"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus, MoreHorizontal, Star } from "lucide-react";
import { useLedger } from "@/lib/store";
import { Bubble, getBubbleTone } from "@/components/Bubble";
import { RadialSubEvents } from "@/components/RadialSubEvents";
import { SegmentedControl } from "@/components/SegmentedControl";
import { cn } from "@/lib/utils";
import { useState } from "react";

type DetailTab = "overview" | "microwins" | "notes";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getEvent } = useLedger();
  const event = getEvent(id);
  const [tab, setTab] = useState<DetailTab>("overview");

  if (!event) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 pt-20 text-center">
        <p className="text-sm text-muted">This event couldn&apos;t be found.</p>
        <Link href="/" className="text-sm font-medium text-accent">Back to timeline</Link>
      </div>
    );
  }

  const tabOptions = [
    { value: "overview" as const, label: "Overview" },
    { value: "microwins" as const, label: `Microwins (${event.subEvents.length})` },
    { value: "notes" as const, label: "Notes" },
  ];

  return (
    <div className="min-h-full pb-6">
      <div className="flex items-center justify-between px-4 pt-1">
        <button type="button" onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-full text-foreground">
          <ChevronLeft size={22} />
        </button>
        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full text-muted">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="px-4 text-center">
        {event.significance >= 4 && (
          <Star size={18} className="mx-auto mb-1 fill-[#fbbf24] text-[#fbbf24]" />
        )}
        <h1 className="serif-heading text-xl text-foreground">{event.title}</h1>
        <p className="mt-1 text-xs text-muted">
          {new Date(event.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="mt-5 px-4">
        <SegmentedControl options={tabOptions} value={tab} onChange={setTab} variant="underline" />
      </div>

      <div className="mt-5 px-4">
        {tab === "overview" && (
          <>
            {event.subEvents.length > 0 ? (
              <RadialSubEvents event={event} />
            ) : (
              <div className="flex justify-center py-8">
                <Bubble category={event.category} significance={event.significance} tone={getBubbleTone(event.category, event.id)} />
              </div>
            )}

            <div className="card-surface mt-4 p-4">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">About this event</h3>
              <p className="text-[13px] leading-relaxed text-foreground/85">{event.description}</p>
            </div>
          </>
        )}

        {tab === "microwins" && (
          <div className="space-y-3">
            {event.subEvents.length === 0 ? (
              <div className="card-surface p-6 text-center text-sm text-muted">No microwins yet.</div>
            ) : (
              event.subEvents.map((sub, i) => {
                const tagClass = i % 3 === 0 ? "tag-wins" : i % 3 === 1 ? "tag-impact" : "tag-growth";
                const tagLabel = i % 3 === 0 ? "Wins" : i % 3 === 1 ? "Impact" : "Growth";

                return (
                  <Link key={sub.id} href={`/event/${event.id}/sub/${sub.id}`} className="block">
                    <div className="relative flex gap-3">
                      <div className="relative w-12 shrink-0">
                        <div className="timeline-axis absolute bottom-0 left-[18px] top-0 w-px" />
                        <span className="text-[10px] text-muted">
                          {new Date(sub.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <div className="card-surface mb-2 flex-1 p-3">
                        <p className="text-[13px] font-semibold leading-snug">{sub.title}</p>
                        <p className="mt-1 line-clamp-2 text-[11px] text-muted">{sub.description}</p>
                        <span className={cn("mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold", tagClass)}>
                          {tagLabel}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}

        {tab === "notes" && (
          <div className="card-surface p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Notes</p>
            <p className="mt-2 text-[13px] leading-relaxed text-foreground/85">{event.description}</p>
          </div>
        )}

        <Link
          href={`/event/${event.id}/sub/new`}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full gradient-accent py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(124,58,237,0.45)]"
        >
          <Plus size={18} />
          Add Microwin
        </Link>
      </div>
    </div>
  );
}
