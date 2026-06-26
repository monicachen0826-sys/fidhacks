"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Share2, Check } from "lucide-react";
import { useLedger } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bubble } from "@/components/Bubble";
import { AiSummaryCard } from "@/components/AiSummaryCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

  const projects = useMemo(() => portfolioEvents.filter((e) => e.category !== "personal"), [portfolioEvents]);

  const skills = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of portfolioEvents) {
      for (const s of e.skills) counts.set(s, (counts.get(s) ?? 0) + 1);
      for (const se of e.subEvents) for (const s of se.skillTags) counts.set(s, (counts.get(s) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [portfolioEvents]);
  const maxSkillCount = skills[0]?.[1] ?? 1;

  const stories = useMemo(() => portfolioEvents.filter((e) => e.aiSummary), [portfolioEvents]);

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
    <div className="px-5 pt-6 pb-24">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Shareable</p>
          <h1 className="mt-1 text-[26px] font-semibold tracking-tight">Portfolio</h1>
        </div>
        <button className="mt-1 text-sm font-medium text-[#4f7cff]">Preview</button>
      </header>

      {portfolioEvents.length === 0 ? (
        <div className="card-surface p-8 text-center text-sm text-muted">
          Mark events as portfolio-visible to feature them here.
        </div>
      ) : (
        <Tabs defaultValue="highlights">
          <TabsList className="mb-5">
            <TabsTrigger value="highlights">Highlights</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="story">Story</TabsTrigger>
          </TabsList>

          <TabsContent value="highlights">
            <div className="space-y-3">
              {portfolioEvents.map((e) => (
                <Link key={e.id} href={`/event/${e.id}`}>
                  <Card>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Bubble category={e.category} significance={3} className="h-9 w-9 text-[10px] font-semibold">
                          {e.skills[0]?.slice(0, 2).toUpperCase() ?? e.title.slice(0, 2).toUpperCase()}
                        </Bubble>
                        <div>
                          <h3 className="text-[15px] font-semibold leading-tight">{e.title}</h3>
                          <p className="text-xs text-muted">
                            {new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          e.significance >= 4 ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600"
                        }`}
                      >
                        {e.significance >= 4 ? "High" : "Medium"}
                      </span>
                    </div>
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
          </TabsContent>

          <TabsContent value="projects">
            {projects.length === 0 ? (
              <div className="card-surface p-6 text-center text-sm text-muted">No professional projects yet.</div>
            ) : (
              <div className="space-y-3">
                {projects.map((e) => (
                  <Link key={e.id} href={`/event/${e.id}`}>
                    <Card>
                      <h3 className="text-[15px] font-semibold leading-tight">{e.title}</h3>
                      <p className="mt-1 text-xs text-muted">
                        {new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {e.skills.map((s) => (
                          <Badge key={s}>{s}</Badge>
                        ))}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <h2 className="mb-3 text-sm font-semibold">Skills Showcased</h2>
              <div className="space-y-3">
                {skills.map(([skill, count]) => (
                  <div key={skill}>
                    <div className="mb-1 flex items-center justify-between text-[13px]">
                      <span className="font-medium">{skill}</span>
                      <span className="text-muted">{count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-black/5">
                      <div className="h-full gradient-accent" style={{ width: `${(count / maxSkillCount) * 100}%` }} />
                    </div>
                  </div>
                ))}
                {skills.length === 0 && <p className="text-sm text-muted">No skills logged yet.</p>}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="story">
            <div className="space-y-3">
              {stories.length === 0 ? (
                <div className="card-surface p-6 text-center text-sm text-muted">No story yet.</div>
              ) : (
                stories.map((e) => <AiSummaryCard key={e.id} text={e.aiSummary!} />)
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {portfolioEvents.length > 0 && (
        <Button className="mt-6 w-full" onClick={handleShare}>
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          {copied ? "Copied!" : "Share Portfolio"}
        </Button>
      )}
    </div>
  );
}
