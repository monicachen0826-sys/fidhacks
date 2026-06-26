"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Share2, Star } from "lucide-react";
import { useLedger } from "@/lib/store";
import { AppHeader } from "@/components/AppHeader";
import { SegmentedControl } from "@/components/SegmentedControl";
import { Bubble, getBubbleTone } from "@/components/Bubble";

type PortfolioTab = "highlights" | "projects" | "skills" | "story";

export default function PortfolioPage() {
  const { events } = useLedger();
  const [tab, setTab] = useState<PortfolioTab>("highlights");
  const [copied, setCopied] = useState(false);

  const portfolioEvents = useMemo(() => events.filter((e) => e.visibility === "portfolio").sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [events]);

  return (
    <div className="min-h-full pb-8">
      <AppHeader title="Portfolio" showMenu={false} />
      <div className="px-4">
        <h2 className="serif-heading mb-4 text-2xl">Portfolio</h2>
        <SegmentedControl options={[{ value: "highlights", label: "Highlights" }, { value: "projects", label: "Projects" }, { value: "skills", label: "Skills" }, { value: "story", label: "Story" }]} value={tab} onChange={setTab} />

        <div className="mt-5 space-y-3">
          {tab === "highlights" && portfolioEvents.map((e) => (
            <Link key={e.id} href={`/event/${e.id}`} className="card-surface flex items-start gap-3 p-3">
              <Bubble category={e.category} significance={Math.min(e.significance, 3) as 1 | 2 | 3} tone={getBubbleTone(e.category, e.id)} />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold">{e.title}</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: Math.min(e.significance, 3) }).map((_, i) => <Star key={i} size={10} className="fill-[#fbbf24] text-[#fbbf24]" />)}
                  </div>
                </div>
                <p className="text-[11px] text-muted">{new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
            </Link>
          ))}
          {tab === "projects" && events.filter((e) => e.category === "professional").map((e) => (
            <Link key={e.id} href={`/event/${e.id}`} className="card-surface block p-3"><p className="font-bold">{e.title}</p><p className="mt-1 text-[11px] text-muted">{e.description.slice(0, 80)}...</p></Link>
          ))}
          {tab === "skills" && (
            <div className="flex flex-wrap gap-2">{[...new Set(events.flatMap((e) => e.skills))].map((s) => <span key={s} className="rounded-full bg-accent/15 px-3 py-1 text-[12px] text-accent">{s}</span>)}</div>
          )}
        </div>

        <button type="button" onClick={async () => { await navigator.clipboard.writeText(portfolioEvents.map((e) => e.title).join("\n")); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full gradient-accent py-3.5 text-sm font-bold text-white">
          <Share2 size={16} />{copied ? "Copied!" : "Share Portfolio"}
        </button>
      </div>
    </div>
  );
}
