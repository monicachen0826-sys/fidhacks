"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SlidersHorizontal, List, Plus, Star } from "lucide-react";
import { Bubble, getBubbleTone } from "@/components/Bubble";
import { SegmentedControl } from "@/components/SegmentedControl";
import { AppHeader, SideMenu } from "@/components/AppHeader";
import { EventTimelineRow } from "@/components/EventTimelineRow";
import { useLedger } from "@/lib/store";
import type { Event, TimelineFilter } from "@/lib/types";
import { cn } from "@/lib/utils";

const DOT_COLORS: Record<string, string> = {
  purple: "bg-[#6347d9]",
  blue: "bg-[#4f7cff]",
  green: "bg-[#34d399]",
  pink: "bg-[#ff7a8a]",
  orange: "bg-[#f97316]",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatMonth(date: string) {
  return new Date(date).toLocaleDateString(undefined, { month: "short" });
}

function formatYear(date: string) {
  return new Date(date).getFullYear().toString();
}

interface TimelineGroup {
  year: string;
  months: {
    month: string;
    events: Event[];
  }[];
}

function groupEventsByDate(events: Event[]): TimelineGroup[] {
  const sorted = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const groups: TimelineGroup[] = [];

  for (const event of sorted) {
    const year = formatYear(event.date);
    const month = formatMonth(event.date);

    let yearGroup = groups.find((g) => g.year === year);
    if (!yearGroup) {
      yearGroup = { year, months: [] };
      groups.push(yearGroup);
    }

    let monthGroup = yearGroup.months.find((m) => m.month === month);
    if (!monthGroup) {
      monthGroup = { month, events: [] };
      yearGroup.months.push(monthGroup);
    }

    monthGroup.events.push(event);
  }

  return groups;
}

function filterEvents(events: Event[], filter: TimelineFilter): Event[] {
  switch (filter) {
    case "professional":
      return events.filter((e) => e.category === "professional");
    case "personal":
      return events.filter((e) => e.category === "personal");
    default:
      return events;
  }
}

function TimelineEventBubble({ event, offset }: { event: Event; offset: number }) {
  const tone = getBubbleTone(event.category, event.id);
  const showStar = event.significance >= 4;

  return (
    <Link href={`/event/${event.id}`} className="block">
      <motion.div whileTap={{ scale: 0.95 }} className="relative" style={{ marginLeft: offset }}>
        <Bubble category={event.category} significance={event.significance} tone={tone}>
          <div className="relative z-10 flex flex-col items-center justify-center px-2 text-center">
            {showStar && (
              <Star size={12} className="mb-0.5 fill-[#fbbf24] text-[#fbbf24]" />
            )}
            <p className="text-[11px] font-bold leading-tight">{event.title}</p>
            <p className="mt-0.5 text-[10px] font-medium opacity-90">{formatDate(event.date)}</p>
          </div>
        </Bubble>
      </motion.div>
    </Link>
  );
}

export default function TimelineView() {
  const { events } = useLedger();
  const [filter, setFilter] = useState<TimelineFilter>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"bubbles" | "list">("bubbles");

  const filtered = useMemo(() => filterEvents(events, filter), [events, filter]);
  const grouped = useMemo(() => groupEventsByDate(filtered), [filtered]);
  const sortedList = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [filtered]
  );

  const filterOptions: { value: TimelineFilter; label: string }[] = [
    { value: "all", label: "Life" },
    { value: "professional", label: "Professional" },
    { value: "personal", label: "Personal" },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md">
        <AppHeader onMenuClick={() => setMenuOpen(true)} />
        <div className="px-4 pb-3">
          <SegmentedControl options={filterOptions} value={filter} onChange={setFilter} />
        </div>
      </header>

      <div className="px-4 pb-24">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Timeline</h2>
            <p className="mt-0.5 text-sm text-muted">Your life. Visualized.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full text-muted">
              <SlidersHorizontal size={18} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode((v) => (v === "bubbles" ? "list" : "bubbles"))}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                viewMode === "list" ? "bg-accent/10 text-accent" : "text-muted"
              )}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="relative">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted">No events yet. Tap + to add your first moment.</p>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-0">
              {sortedList.map((event, i) => (
                <EventTimelineRow key={event.id} event={event} isLast={i === sortedList.length - 1} />
              ))}
            </div>
          ) : (
            <div className="relative">
              {grouped.map((yearGroup) => (
                <div key={yearGroup.year}>
                  {yearGroup.months.map((monthGroup, monthIdx) => (
                    <div key={`${yearGroup.year}-${monthGroup.month}`}>
                      {monthIdx === 0 && (
                        <div className="mb-2 pl-4">
                          <span className="text-sm font-bold text-foreground">{yearGroup.year}</span>
                        </div>
                      )}

                      {monthGroup.events.map((event, eventIdx) => {
                        const tone = getBubbleTone(event.category, event.id);
                        const offset = eventIdx % 3 === 0 ? 0 : eventIdx % 3 === 1 ? 20 : 10;
                        const isFirstInMonth = eventIdx === 0;

                        return (
                          <div key={event.id} className="relative flex min-h-[150px]">
                            <div className="relative w-16 shrink-0">
                              <div className="timeline-axis absolute bottom-0 left-[30px] top-0 w-px" />
                              <div className="relative flex h-full flex-col justify-center pl-2 pr-2">
                                {isFirstInMonth && (
                                  <span className="text-xs font-medium text-muted">{monthGroup.month}</span>
                                )}
                                <div
                                  className={cn(
                                    "absolute left-[26px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ring-2 ring-background",
                                    DOT_COLORS[tone]
                                  )}
                                />
                              </div>
                            </div>

                            <div className="flex flex-1 items-center py-1 pr-2">
                              <TimelineEventBubble event={event} offset={offset} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <Link
            href="/event/new"
            className="fixed bottom-32 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_24px_rgba(99,71,217,0.45)] transition-transform active:scale-95"
          >
            <Plus size={22} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
