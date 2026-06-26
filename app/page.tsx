"use client";

import { useMemo, useState } from "react";
import { Menu, SlidersHorizontal, List } from "lucide-react";
import { useLedger } from "@/lib/store";
import { SegmentedControl } from "@/components/SegmentedControl";
import { EventZigzagTimeline } from "@/components/EventZigzagTimeline";

type LifeFilter = "life" | "professional" | "personal";

const FILTERS: { value: LifeFilter; label: string }[] = [
  { value: "life", label: "Life" },
  { value: "professional", label: "Professional" },
  { value: "personal", label: "Personal" },
];

export default function HomePage() {
  const { events } = useLedger();
  const [filter, setFilter] = useState<LifeFilter>("life");

  const visible = useMemo(() => {
    const sorted = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (filter === "life") return sorted;
    return sorted.filter((e) => e.category === filter || e.category === "both");
  }, [events, filter]);

  return (
    <div className="px-5 pt-6">
      <div className="flex items-center justify-between">
        <button aria-label="Menu" className="flex h-9 w-9 items-center justify-center rounded-full">
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold tracking-tight">My Ledger</h1>
        <div className="h-9 w-9 overflow-hidden rounded-full bg-black/10" />
      </div>

      <div className="mt-5">
        <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      <div className="mt-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Timeline</h2>
          <p className="text-sm text-muted">Your life. Visualized.</p>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Filter options" className="flex h-8 w-8 items-center justify-center rounded-full card-surface">
            <SlidersHorizontal size={14} />
          </button>
          <button aria-label="List view" className="flex h-8 w-8 items-center justify-center rounded-full card-surface">
            <List size={14} />
          </button>
        </div>
      </div>

      <div className="mt-5 pb-10">
        <EventZigzagTimeline events={visible} />
      </div>
    </div>
  );
}
