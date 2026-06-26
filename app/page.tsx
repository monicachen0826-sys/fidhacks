"use client";

import { useMemo, useState } from "react";
import { Star, Zap, Sparkles } from "lucide-react";
import { useLedger } from "@/lib/store";
import { SegmentedControl } from "@/components/SegmentedControl";
import { EventClusterMap } from "@/components/EventClusterMap";

type LifeFilter = "all" | "professional" | "personal" | "portfolio";

const FILTERS: { value: LifeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "professional", label: "Professional" },
  { value: "personal", label: "Personal" },
  { value: "portfolio", label: "Portfolio" },
];

export default function HomePage() {
  const { events } = useLedger();
  const [filter, setFilter] = useState<LifeFilter>("all");

  const visible = useMemo(() => {
    const sorted = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (filter === "all") return sorted;
    if (filter === "portfolio") return sorted.filter((e) => e.visibility === "portfolio");
    return sorted.filter((e) => e.category === filter || e.category === "both");
  }, [events, filter]);

  const stats = useMemo(() => {
    const microWins = events.reduce((sum, e) => sum + e.subEvents.length, 0);
    const skillSet = new Set<string>();
    for (const e of events) {
      for (const s of e.skills) skillSet.add(s);
      for (const se of e.subEvents) for (const s of se.skillTags) skillSet.add(s);
    }
    return { events: events.length, microWins, skills: skillSet.size };
  }, [events]);

  return (
    <div className="relative px-5 pt-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Your Story</p>
      <h1 className="mt-1 text-[28px] font-semibold tracking-tight">Probble</h1>
      <p className="text-sm text-muted">Every milestone. Every win. Forever.</p>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <div className="card-surface flex flex-col items-center gap-1.5 p-3 text-center">
          <Star size={16} className="text-[#8a5cf6]" />
          <p className="text-lg font-semibold leading-none">{stats.events}</p>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Events</p>
        </div>
        <div className="card-surface flex flex-col items-center gap-1.5 p-3 text-center">
          <Zap size={16} className="text-[#ff7a8a]" />
          <p className="text-lg font-semibold leading-none">{stats.microWins}</p>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Micro-wins</p>
        </div>
        <div className="card-surface flex flex-col items-center gap-1.5 p-3 text-center">
          <Sparkles size={16} className="text-[#ff9f5a]" />
          <p className="text-lg font-semibold leading-none">{stats.skills}</p>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Skills</p>
        </div>
      </div>

      <div className="my-5">
        <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      <div className="card-surface overflow-hidden p-4">
        <EventClusterMap events={visible} width={308} />
      </div>
    </div>
  );
}
