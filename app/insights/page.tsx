"use client";

import { useMemo } from "react";
import { Flame, Star, Zap, Briefcase } from "lucide-react";
import { useLedger } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function monthKey(date: string) {
  return date.slice(0, 7);
}

function monthLabel(key: string) {
  return new Date(`${key}-01`).toLocaleDateString(undefined, { month: "short" });
}

const SKILL_COLORS = [
  "bg-violet-500",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-blue-500",
  "bg-red-500",
  "bg-cyan-500",
  "bg-fuchsia-500",
];

export default function InsightsPage() {
  const { events } = useLedger();

  const headerStats = useMemo(() => {
    const microWins = events.reduce((sum, e) => sum + e.subEvents.length, 0);
    const portfolio = events.filter((e) => e.visibility === "portfolio").length;
    return { events: events.length, microWins, portfolio };
  }, [events]);

  const stats = useMemo(() => {
    const skillCounts = new Map<string, number>();
    const significanceCounts = new Map<number, number>();
    const monthSet = new Set<string>();
    const monthCounts = new Map<string, number>();

    for (const e of events) {
      for (const s of e.skills) skillCounts.set(s, (skillCounts.get(s) ?? 0) + 1);
      significanceCounts.set(e.significance, (significanceCounts.get(e.significance) ?? 0) + 1);
      const eMonth = monthKey(e.date);
      monthSet.add(eMonth);
      monthCounts.set(eMonth, (monthCounts.get(eMonth) ?? 0) + 1);
      for (const se of e.subEvents) {
        for (const s of se.skillTags) skillCounts.set(s, (skillCounts.get(s) ?? 0) + 1);
        const seMonth = monthKey(se.date);
        monthSet.add(seMonth);
        monthCounts.set(seMonth, (monthCounts.get(seMonth) ?? 0) + 1);
      }
    }

    const topSkills = [...skillCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxSkillCount = topSkills[0]?.[1] ?? 1;

    const distribution = [1, 2, 3, 4, 5].map((level) => ({
      level,
      count: significanceCounts.get(level) ?? 0,
    }));
    const maxDistCount = Math.max(...distribution.map((d) => d.count), 1);

    let streak = 0;
    const cursor = new Date();
    while (true) {
      const key = cursor.toISOString().slice(0, 7);
      if (monthSet.has(key)) {
        streak += 1;
        cursor.setMonth(cursor.getMonth() - 1);
      } else break;
    }

    const recent = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
    const themes = [...new Set(recent.flatMap((e) => e.skills))].slice(0, 5);

    const monthlyTrend = [...monthCounts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([key, count]) => ({ key, label: monthLabel(key), count }));
    const maxMonthlyCount = Math.max(...monthlyTrend.map((m) => m.count), 1);

    return { topSkills, maxSkillCount, distribution, maxDistCount, streak, themes, monthlyTrend, maxMonthlyCount };
  }, [events]);

  return (
    <div className="px-5 pt-6">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Growth Overview</p>
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight">Insights</h1>
      </header>

      <div className="mb-5 grid grid-cols-3 gap-2.5">
        <div className="card-surface flex flex-col items-center gap-1.5 p-3 text-center">
          <Star size={16} className="text-[#8a5cf6]" />
          <p className="text-lg font-semibold leading-none">{headerStats.events}</p>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Events</p>
        </div>
        <div className="card-surface flex flex-col items-center gap-1.5 p-3 text-center">
          <Zap size={16} className="text-[#ff7a8a]" />
          <p className="text-lg font-semibold leading-none">{headerStats.microWins}</p>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Micro-wins</p>
        </div>
        <div className="card-surface flex flex-col items-center gap-1.5 p-3 text-center">
          <Briefcase size={16} className="text-[#34d399]" />
          <p className="text-lg font-semibold leading-none">{headerStats.portfolio}</p>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Portfolio</p>
        </div>
      </div>

      <Tabs defaultValue="skills">
        <TabsList className="mb-5">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <Card>
            <h2 className="text-sm font-semibold">Skill Growth</h2>
            <p className="mb-3 text-xs text-muted">See how your skills have grown over time.</p>
            <div className="space-y-3">
              {stats.topSkills.map(([skill, count], i) => {
                const pct = Math.round((count / stats.maxSkillCount) * 100);
                return (
                  <div key={skill}>
                    <div className="mb-1 flex items-center justify-between text-[13px]">
                      <span className="font-medium">{skill}</span>
                      <span className="text-muted">{pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-black/5">
                      <div
                        className={`h-full rounded-full ${SKILL_COLORS[i % SKILL_COLORS.length]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {stats.topSkills.length === 0 && <p className="text-sm text-muted">Log events to see your top skills.</p>}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="growth">
          <Card className="mb-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-accent text-white">
              <Flame size={20} />
            </div>
            <div>
              <p className="text-lg font-semibold leading-tight">{stats.streak} month streak</p>
              <p className="text-xs text-muted">Consecutive months with logged growth</p>
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold">Impact Distribution</h2>
            <div className="flex items-end justify-between gap-2 h-28">
              {stats.distribution.map((d) => (
                <div key={d.level} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex h-20 w-full items-end">
                    <div
                      className="w-full rounded-t-lg gradient-professional"
                      style={{ height: `${(d.count / stats.maxDistCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-muted">L{d.level}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card className="mb-4">
            <h2 className="mb-3 text-sm font-semibold">Monthly Activity</h2>
            <div className="flex items-end justify-between gap-2 h-28">
              {stats.monthlyTrend.map((m) => (
                <div key={m.key} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex h-20 w-full items-end">
                    <div
                      className="w-full rounded-t-lg gradient-personal"
                      style={{ height: `${(m.count / stats.maxMonthlyCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-muted">{m.label}</span>
                </div>
              ))}
              {stats.monthlyTrend.length === 0 && <p className="text-sm text-muted">No activity yet.</p>}
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold">Recent Growth Themes</h2>
            <div className="flex flex-wrap gap-1.5">
              {stats.themes.length === 0 ? (
                <p className="text-sm text-muted">No recent themes yet.</p>
              ) : (
                stats.themes.map((t) => <Badge key={t}>{t}</Badge>)
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
