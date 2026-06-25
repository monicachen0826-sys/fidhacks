"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useLedger } from "@/lib/store";
import { SegmentedControl } from "@/components/SegmentedControl";
import { EventTimelineRow } from "@/components/EventTimelineRow";
import type { TimelineFilter } from "@/lib/types";

const FILTERS: { value: TimelineFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "professional", label: "Professional" },
  { value: "personal", label: "Personal" },
  { value: "portfolio", label: "Portfolio" },
];

export default function HomePage() {
  const { events } = useLedger();
  const [filter, setFilter] = useState<TimelineFilter>("all");

  const visible = useMemo(() => {
    const sorted = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (filter === "all") return sorted;
    if (filter === "portfolio") return sorted.filter((e) => e.visibility === "portfolio");
    return sorted.filter((e) => e.category === filter || e.category === "both");
  }, [events, filter]);

  return (
    <div className="relative px-5 pt-6">
      <header className="mb-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Proof-of-Skill Ledger</p>
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight">Your Journey</h1>
      </header>

      <div className="mb-6">
        <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {visible.length === 0 ? (
        <div className="card-surface flex flex-col items-center gap-2 p-8 text-center">
          <p className="text-sm text-muted">Nothing here yet — log your first win.</p>
        </div>
      ) : (
        <div>
          {visible.map((event, i) => (
            <EventTimelineRow key={event.id} event={event} isLast={i === visible.length - 1} />
          ))}
        </div>
      )}

      <Link
        href="/event/new"
        className="fixed bottom-28 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full gradient-accent text-white shadow-[0_10px_30px_rgba(80,80,255,0.35)] active:scale-95"
        aria-label="Add new event"
      >
        <Plus size={26} strokeWidth={2.5} />
      </Link>
    </div>
  );
}
