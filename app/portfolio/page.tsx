"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Share2, Star, ExternalLink } from "lucide-react";
import { useLedger } from "@/lib/store";
import { AppHeader } from "@/components/AppHeader";
import { SegmentedControl } from "@/components/SegmentedControl";
import { Bubble, getBubbleTone } from "@/components/Bubble";
import { AiSummaryCard } from "@/components/AiSummaryCard";

type PortfolioTab = "highlights" | "projects" | "skills" | "story";

function ImpactStars({ level }: { level: number }) {
  const label = level >= 4 ? "High" : level >= 3 ? "Medium" : "Low";
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] font-semibold text-muted">{label}</span>
      {Array.from({ length: Math.min(level, 3) }).map((_, i) => (
        <Star key={i} size={12} className="fill-[#fbbf24] text-[#fbbf24]" />
      ))}
    </div>
  );
}

export default function PortfolioPage() {
  const { events } = useLedger();
  const [tab, setTab] = useState<PortfolioTab>("highlights");
  const [copied, setCopied] = useState(false);

  const portfolioEvents = useMemo(
    () =>
      events
        .filter((e) => e.visibility === "portfolio")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [events]
  );

  const allSkills = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of events) {
      for (const s of e.skills) counts.set(s, (counts.get(s) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [events]);

  const storyText = useMemo(
    () =>
      portfolioEvents
        .slice(0, 3)
        .map((e) => e.aiSummary ?? e.description)
        .join(" "),
    [portfolioEvents]
  );

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(
        `My Ledger Portfolio\n\n${portfolioEvents.map((e) => `• ${e.title} — ${e.aiSummary ?? e.description}`).join("\n\n")}`
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  const tabOptions: { value: PortfolioTab; label: string }[] = [
    { value: "highlights", label: "Highlights" },
    { value: "projects", label: "Projects" },
    { value: "skills", label: "Skills" },
    { value: "story", label: "Story" },
  ];

  return (
    <div className="min-h-screen bg-background pb-28">
      <AppHeader title="Portfolio" showMenu={false} />

      <div className="px-4">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Portfolio</h2>
            <p className="mt-0.5 text-sm text-muted">Your shareable highlights.</p>
          </div>
          <button type="button" className="text-xs font-semibold text-accent">
            Preview <ExternalLink size={12} className="inline ml-0.5" />
          </button>
        </div>

        <SegmentedControl options={tabOptions} value={tab} onChange={setTab} />

        <div className="mt-6 space-y-3">
          {tab === "highlights" &&
            (portfolioEvents.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-sm">
                Mark events as portfolio-visible to feature them here.
              </div>
            ) : (
              portfolioEvents.map((e) => (
                <Link key={e.id} href={`/event/${e.id}`} className="block rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Bubble
                      category={e.category}
                      significance={Math.min(e.significance, 3) as 1 | 2 | 3}
                      tone={getBubbleTone(e.category, e.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[15px] font-bold leading-tight">{e.title}</h3>
                        <ImpactStars level={e.significance} />
                      </div>
                      <p className="mt-0.5 text-xs text-muted">
                        {new Date(e.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {e.aiSummary && (
                        <p className="mt-2 line-clamp-2 text-[13px] text-foreground/70">{e.aiSummary}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ))}

          {tab === "projects" &&
            events
              .filter((e) => e.category === "professional")
              .map((e) => (
                <Link key={e.id} href={`/event/${e.id}`} className="block rounded-2xl bg-white p-4 shadow-sm">
                  <h3 className="font-bold">{e.title}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(e.date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                  </p>
                  <p className="mt-2 line-clamp-2 text-[13px] text-foreground/70">{e.description}</p>
                </Link>
              ))}

          {tab === "skills" && (
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {allSkills.map(([skill, count]) => (
                  <span
                    key={skill}
                    className="rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-semibold text-accent"
                  >
                    {skill} <span className="text-muted">({count})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {tab === "story" && (
            <AiSummaryCard
              text={
                storyText ||
                "Add portfolio-visible events and AI will weave them into your growth story."
              }
            />
          )}
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(99,71,217,0.4)]"
        >
          <Share2 size={16} />
          {copied ? "Copied!" : "Share Portfolio"}
        </button>
      </div>
    </div>
  );
}
