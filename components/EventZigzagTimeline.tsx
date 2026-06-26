"use client";

import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event, Category, Significance } from "@/lib/types";

const GRADIENT_MAP: Record<Category, string> = {
  professional: "gradient-professional",
  personal: "gradient-personal",
  both: "gradient-accent",
};

const BUBBLE_SIZE: Record<Significance, number> = { 1: 116, 2: 128, 3: 140, 4: 152, 5: 164 };

function monthLabel(date: string) {
  return new Date(date).toLocaleDateString(undefined, { month: "short" });
}

function dayLabel(date: string) {
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function yearLabel(date: string) {
  return new Date(date).getFullYear();
}

export function EventZigzagTimeline({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="card-surface flex flex-col items-center gap-2 p-8 text-center">
        <p className="text-sm text-muted">Nothing here yet — log your first win.</p>
      </div>
    );
  }

  const rows = events.map((event, i) => {
    const year = yearLabel(event.date);
    const showYear = i === 0 || year !== yearLabel(events[i - 1].date);
    return { event, year, showYear };
  });

  return (
    <div className="relative">
      <div className="space-y-7">
        {rows.map(({ event, year, showYear }, i) => {
          const size = BUBBLE_SIZE[event.significance];
          const alignRight = i % 2 === 0;

          return (
            <div key={event.id} className="flex items-start gap-3">
              <div className="flex w-9 shrink-0 flex-col items-center pt-1 text-center">
                {showYear && <p className="mb-1 text-[11px] font-semibold text-foreground/70">{year}</p>}
                <p className="text-[11px] font-medium text-muted">{monthLabel(event.date)}</p>
                <span className={cn("mt-1.5 h-2 w-2 rounded-full", GRADIENT_MAP[event.category])} />
              </div>

              <div className={cn("flex flex-1", alignRight ? "justify-end" : "justify-start")}>
                <Link
                  href={`/event/${event.id}`}
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-full p-3 text-center text-white shadow-lg",
                    GRADIENT_MAP[event.category]
                  )}
                  style={{ width: size, height: size }}
                >
                  {event.significance >= 4 && <Star size={14} className="mb-1 fill-current" />}
                  <span className="line-clamp-2 text-[13px] font-semibold leading-tight">{event.title}</span>
                  <span className="mt-1 text-[10px] text-white/80">{dayLabel(event.date)}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href="/event/new"
        aria-label="Add new event"
        className="absolute -bottom-2 right-0 flex h-12 w-12 items-center justify-center rounded-full gradient-accent text-white shadow-[0_10px_30px_rgba(80,80,255,0.4)]"
      >
        <Plus size={22} />
      </Link>
    </div>
  );
}
