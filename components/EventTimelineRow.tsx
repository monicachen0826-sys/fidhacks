"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { Bubble, getBubbleTone } from "@/components/Bubble";
import { SignificanceDots } from "@/components/SignificanceDots";
import type { Event } from "@/lib/types";

export function EventTimelineRow({ event, isLast }: { event: Event; isLast: boolean }) {
  const tone = getBubbleTone(event.category, event.id);

  return (
    <Link href={`/event/${event.id}`} className="block">
      <motion.div whileTap={{ scale: 0.98 }} className="flex gap-3 px-1">
        <div className="flex flex-col items-center pt-1">
          <Bubble category={event.category} significance={Math.min(event.significance, 3) as 1 | 2 | 3} tone={tone} />
          {!isLast && <div className="timeline-axis mt-1 w-px flex-1 min-h-[24px]" />}
        </div>
        <div className="mb-4 flex-1 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-bold leading-tight">{event.title}</h3>
            {event.visibility === "portfolio" && (
              <Bookmark size={15} className="mt-0.5 shrink-0 text-accent" fill="currentColor" />
            )}
          </div>
          <p className="mt-1 text-xs text-muted">
            {new Date(event.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </p>
          <p className="mt-2 text-[13px] text-foreground/80 line-clamp-2">{event.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <SignificanceDots value={event.significance} size="sm" />
            {event.subEvents.length > 0 && (
              <span className="text-xs font-medium text-accent">{event.subEvents.length} micro-wins</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
