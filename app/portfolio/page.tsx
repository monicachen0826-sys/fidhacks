"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Share2, Check } from "lucide-react";
import { useLedger } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SignificanceDots } from "@/components/SignificanceDots";

export default function PortfolioPage() {
  const { events } = useLedger();
  const [copied, setCopied] = useState(false);

  const portfolioEvents = useMemo(
    () =>
      events
        .filter((e) => e.visibility === "portfolio")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [events]
  );

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(
        `My Proof-of-Skill Portfolio:\n${portfolioEvents.map((e) => `• ${e.title}`).join("\n")}`
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="px-5 pt-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Shareable</p>
          <h1 className="mt-1 text-[26px] font-semibold tracking-tight">Portfolio</h1>
        </div>
        <Button size="sm" variant="secondary" onClick={handleShare} className="mt-1">
          {copied ? <Check size={14} /> : <Share2 size={14} />}
          {copied ? "Copied" : "Share"}
        </Button>
      </header>

      {portfolioEvents.length === 0 ? (
        <div className="card-surface p-8 text-center text-sm text-muted">
          Mark events as portfolio-visible to feature them here.
        </div>
      ) : (
        <div className="space-y-3">
          {portfolioEvents.map((e) => (
            <Link key={e.id} href={`/event/${e.id}`}>
              <Card>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[15px] font-semibold leading-tight">{e.title}</h3>
                  <SignificanceDots value={e.significance} size="sm" />
                </div>
                <p className="mt-1 text-xs text-muted">
                  {new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {e.skills.map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
                {e.aiSummary && (
                  <p className="mt-3 line-clamp-2 text-[13px] text-foreground/70">{e.aiSummary}</p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
