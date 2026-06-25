"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { Bubble } from "@/components/Bubble";
import { SignificanceDots } from "@/components/SignificanceDots";
import type { Event } from "@/lib/types";

export function EventTimelineRow({ event, isLast }: { event: Event; isLast: boolean }) {
  return (
    <Link href={`/event/${event.id}`} className="block">
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="flex gap-4"
      >
        <div className="flex flex-col items-center">
          <Bubble category={event.category} significance={event.significance} />
          {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
        </div>
        <div className="card-surface mb-6 flex-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-semibold leading-tight">{event.title}</h3>
            {event.visibility === "portfolio" && (
              <Bookmark size={15} className="mt-0.5 shrink-0 text-[#4f7cff]" fill="#4f7cff" />
            )}
          </div>
          <p className="mt-1 text-xs text-muted">
            {new Date(event.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </p>
          <p className="mt-2 text-[13px] text-foreground/80 line-clamp-2">{event.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <SignificanceDots value={event.significance} size="sm" />
            {event.subEvents.length > 0 && (
              <span className="text-xs text-muted">{event.subEvents.length} micro-wins</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
