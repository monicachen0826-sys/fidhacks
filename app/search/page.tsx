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
    if (!q) return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return list
      .filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.skills.some((s) => s.toLowerCase().includes(q))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, query, filter]);

  const filterOptions: { value: TimelineFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "professional", label: "Professional" },
    { value: "personal", label: "Personal" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader title="Search" showMenu={false} />

      <div className="px-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Search</h2>
          <p className="mt-0.5 text-sm text-muted">Find moments across your ledger.</p>
        </div>

        <div className="relative">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search events, skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div className="mt-4">
          <SegmentedControl options={filterOptions} value={filter} onChange={setFilter} />
        </div>

        <div className="mt-6 space-y-3">
          {results.map((event) => (
            <Link
              key={event.id}
              href={`/event/${event.id}`}
              className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm transition-transform active:scale-[0.98]"
            >
              <Bubble
                category={event.category}
                significance={Math.min(event.significance, 3) as 1 | 2 | 3}
                tone={getBubbleTone(event.category, event.id)}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{event.title}</p>
                <p className="text-xs text-muted">
                  {new Date(event.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {event.skills.slice(0, 2).map((s) => (
                    <span key={s} className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
          {results.length === 0 && (
            <p className="py-8 text-center text-sm text-muted">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
