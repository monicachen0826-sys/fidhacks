"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { useLedger } from "@/lib/store";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Input } from "@/components/ui/input";
import { Bubble } from "@/components/Bubble";

export default function SearchPage() {
  const { events } = useLedger();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const eventMatches = events
      .filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.skills.some((s) => s.toLowerCase().includes(q))
      )
      .map((e) => ({
        kind: "event" as const,
        id: e.id,
        title: e.title,
        date: e.date,
        category: e.category,
        significance: e.significance,
        href: `/event/${e.id}`,
        parent: undefined as string | undefined,
      }));

    const subMatches = events.flatMap((e) =>
      e.subEvents
        .filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.skillTags.some((t) => t.toLowerCase().includes(q))
        )
        .map((s) => ({
          kind: "sub" as const,
          id: s.id,
          title: s.title,
          date: s.date,
          category: e.category,
          significance: s.significance,
          href: `/event/${e.id}/sub/${s.id}`,
          parent: e.title,
        }))
    );

    return [...eventMatches, ...subMatches].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [events, query]);

  return (
    <div className="px-5 pt-6">
      <ScreenHeader title="Search" subtitle="Find anything in your journey" />

      <div className="relative mb-5">
        <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events, micro-wins, skills..."
          className="pl-10"
          autoFocus
        />
      </div>

      {query.trim() === "" ? (
        <p className="px-1 text-sm text-muted">Start typing to search your ledger.</p>
      ) : results.length === 0 ? (
        <p className="px-1 text-sm text-muted">No matches for &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="space-y-2.5">
          {results.map((r) => (
            <Link key={r.id} href={r.href} className="card-surface flex items-center gap-3 p-3">
              <Bubble category={r.category} significance={r.significance} className="h-11 w-11 text-[10px] font-semibold shrink-0">
                {r.title.slice(0, 2).toUpperCase()}
              </Bubble>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium leading-tight">{r.title}</p>
                <p className="truncate text-xs text-muted">
                  {r.parent ? `Micro-win in ${r.parent}` : "Event"} ·{" "}
                  {new Date(r.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
