"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useLedger } from "@/lib/store";
import { SegmentedControl } from "@/components/SegmentedControl";
import { EventTimelineRow } from "@/components/EventTimelineRow";
import { ScreenHeader } from "@/components/ScreenHeader";

type LifeFilter = "life" | "professional" | "personal";

const FILTERS: { value: LifeFilter; label: string }[] = [
  { value: "life", label: "Life" },
  { value: "professional", label: "Professional" },
  { value: "personal", label: "Personal" },
];

function monthLabel(date: string) {
  return new Date(date).toLocaleDateString(undefined, { month: "short" });
}

function yearLabel(date: string) {
  return new Date(date).getFullYear().toString();
}

export default function HomePage() {
  const { events } = useLedger();
  const [filter, setFilter] = useState<LifeFilter>("life");

  const visible = useMemo(() => {
    const sorted = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const filtered = filter === "life" ? sorted : sorted.filter((e) => e.category === filter || e.category === "both");
    return filtered.reduce<{ event: typeof filtered[number]; showMonthLabel: boolean }[]>((acc, event) => {
      const monthKey = `${yearLabel(event.date)}-${monthLabel(event.date)}`;
      const prevKey = acc.length
        ? `${yearLabel(acc[acc.length - 1].event.date)}-${monthLabel(acc[acc.length - 1].event.date)}`
        : "";
      acc.push({ event, showMonthLabel: monthKey !== prevKey });
      return acc;
    }, []);
  }, [events, filter]);

  return (
    <div className="relative px-5 pt-6">
      <ScreenHeader
        title="Your Journey"
        subtitle="Proof-of-Skill Ledger"
        right={
          <Link
            href="/portfolio"
            aria-label="Open portfolio"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-foreground"
          >
            <BookOpen size={16} />
          </Link>
        }
      />

      <div className="mb-6">
        <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {visible.length === 0 ? (
        <div className="card-surface flex flex-col items-center gap-2 p-8 text-center">
          <p className="text-sm text-muted">Nothing here yet — log your first win.</p>
        </div>
      ) : (
        <div>
          {visible.map(({ event, showMonthLabel }, i) => (
            <div key={event.id} className="flex gap-3">
              <div className="w-10 shrink-0 pt-2 text-right">
                {showMonthLabel && (
                  <>
                    <p className="text-[11px] font-semibold text-foreground/70">{monthLabel(event.date)}</p>
                    <p className="text-[10px] text-muted">{yearLabel(event.date)}</p>
                  </>
                )}
              </div>
              <div className="flex-1">
                <EventTimelineRow event={event} isLast={i === visible.length - 1} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
