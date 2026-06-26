"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Lightbulb } from "lucide-react";
import { Bubble, getBubbleTone } from "@/components/Bubble";
import { SegmentedControl } from "@/components/SegmentedControl";
import { AppHeader, SideMenu } from "@/components/AppHeader";
import { useLedger } from "@/lib/store";
import { useOnboarding } from "@/lib/onboarding-store";
import { useProfile } from "@/lib/profile-store";
import { sortEventsForDashboard, dashboardSubtitle, suggestedPromptsFromChecklist } from "@/lib/personalization";
import type { Event, TimelineFilter } from "@/lib/types";
import { cn } from "@/lib/utils";

const DOT_COLORS: Record<string, string> = {
  purple: "bg-[#7c3aed]",
  blue: "bg-[#38bdf8]",
  green: "bg-[#34d399]",
  teal: "bg-[#2dd4bf]",
  pink: "bg-[#ec4899]",
  orange: "bg-[#f97316]",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
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

function TimelineEventBubble({ event, offset, compact }: { event: Event; offset: number; compact?: boolean }) {
  const tone = getBubbleTone(event.category, event.id);
  const showStar = event.significance >= 4;
  const sig = compact ? (Math.min(event.significance, 4) as Event["significance"]) : event.significance;

  return (
    <Link href={`/event/${event.id}`} className="block">
      <motion.div whileTap={{ scale: 0.95 }} style={{ marginLeft: offset }}>
        <Bubble category={event.category} significance={sig} tone={tone}>
          <div className="relative z-10 flex flex-col items-center justify-center px-2 text-center">
            {showStar && <Star size={11} className="mb-0.5 fill-[#fbbf24] text-[#fbbf24]" />}
            <p className="text-[10px] font-bold leading-tight">{event.title}</p>
            <p className="mt-0.5 text-[9px] font-medium opacity-80">{formatDate(event.date)}</p>
          </div>
        </Bubble>
      </motion.div>
    </Link>
  );
}

export default function TimelineView() {
  const { events } = useLedger();
  const { goals, checklist } = useOnboarding();
  const { profile } = useProfile();
  const [filter, setFilter] = useState<TimelineFilter>(profile.preferences.defaultTimelineFilter);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setFilter(profile.preferences.defaultTimelineFilter);
  }, [profile.preferences.defaultTimelineFilter]);

  const filtered = useMemo(() => {
    const base = filterEvents(events, filter);
    return sortEventsForDashboard(base, goals);
  }, [events, filter, goals]);

  const suggestions = useMemo(() => suggestedPromptsFromChecklist(checklist).slice(0, 3), [checklist]);
  const subtitle = dashboardSubtitle(goals);

  const filterOptions: { value: TimelineFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "professional", label: "Professional" },
    { value: "personal", label: "Personal" },
  ];

  return (
    <div className="relative min-h-full">
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <header className="sticky top-0 z-30 bg-[#0a0a1a]/80 backdrop-blur-md">
        <AppHeader onMenuClick={() => setMenuOpen(true)} profileName={profile.name} />
        <div className="px-4 pb-3">
          <SegmentedControl options={filterOptions} value={filter} onChange={setFilter} />
        </div>
      </header>

      <div className="px-4 pb-6">
        <div className="mb-5">
          <h2 className="serif-heading text-2xl text-foreground">Your timeline</h2>
          <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
        </div>

        {suggestions.length > 0 && (
          <div className="card-surface mb-4 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-accent">
              <Lightbulb size={14} />
              Based on your survey
            </div>
            <ul className="space-y-1">
              {suggestions.map((s) => (
                <li key={s} className="text-[12px] text-muted">• {s}</li>
              ))}
            </ul>
            <Link href="/event/new" className="mt-2 inline-block text-[12px] font-semibold text-accent">
              + Add a moment
            </Link>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-muted">No events yet. Tap + to add your first moment.</p>
          </div>
        ) : (
          <div className="relative space-y-2">
            {filtered.map((event, i) => {
              const tone = getBubbleTone(event.category, event.id);
              const offset = profile.preferences.compactTimeline ? 12 : i % 3 === 0 ? 8 : i % 3 === 1 ? 28 : 16;

              return (
                <div key={event.id} className={cn("relative flex items-center", profile.preferences.compactTimeline ? "min-h-[120px]" : "min-h-[140px]")}>
                  <div className="relative w-14 shrink-0 self-stretch">
                    <div className="timeline-axis absolute bottom-0 left-[22px] top-0 w-px" />
                    <div className="relative flex h-full flex-col justify-center">
                      <span className="pl-1 text-[11px] font-medium text-muted">{formatDate(event.date)}</span>
                      <div className={cn("absolute left-[18px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ring-2 ring-[#0a0a1a]", DOT_COLORS[tone])} />
                    </div>
                  </div>
                  <div className="flex flex-1 items-center py-2">
                    <TimelineEventBubble event={event} offset={offset} compact={profile.preferences.compactTimeline} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
