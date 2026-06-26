"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { useLedger } from "@/lib/store";
import { AppHeader } from "@/components/AppHeader";
import { Bubble, getBubbleTone } from "@/components/Bubble";
import { SegmentedControl } from "@/components/SegmentedControl";
import type { TimelineFilter } from "@/lib/types";

export default function SearchPage() {
  const { events } = useLedger();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<TimelineFilter>("all");

  const results = useMemo(() => {
    let list = events;
    if (filter === "professional") list = list.filter((e) => e.category === "professional");
    if (filter === "personal") list = list.filter((e) => e.category === "personal");
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.skills.some((s) => s.toLowerCase().includes(q)));
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, query, filter]);

  return (
    <div className="min-h-full pb-6">
      <AppHeader title="Search" showMenu={false} />
      <div className="px-4">
        <div className="relative">
          <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input type="search" placeholder="Search events, skills..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-full glass-dark py-3 pl-11 pr-4 text-sm outline-none placeholder:text-muted" />
        </div>
        <div className="mt-3">
          <SegmentedControl options={[{ value: "all", label: "All" }, { value: "professional", label: "Professional" }, { value: "personal", label: "Personal" }]} value={filter} onChange={setFilter} />
        </div>
        <div className="mt-5 space-y-2">
          {results.map((event) => (
            <Link key={event.id} href={`/event/${event.id}`} className="card-surface flex items-center gap-3 p-3">
              <Bubble category={event.category} significance={Math.min(event.significance, 3) as 1 | 2 | 3} tone={getBubbleTone(event.category, event.id)} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{event.title}</p>
                <p className="text-[11px] text-muted">{new Date(event.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
