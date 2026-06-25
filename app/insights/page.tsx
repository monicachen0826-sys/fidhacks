"use client";

import { useMemo } from "react";
import { Flame } from "lucide-react";
import { useLedger } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function monthKey(date: string) {
  return date.slice(0, 7);
}

export default function InsightsPage() {
  const { events } = useLedger();

  const stats = useMemo(() => {
    const skillCounts = new Map<string, number>();
    const significanceCounts = new Map<number, number>();
    const monthSet = new Set<string>();

    for (const e of events) {
      for (const s of e.skills) skillCounts.set(s, (skillCounts.get(s) ?? 0) + 1);
      significanceCounts.set(e.significance, (significanceCounts.get(e.significance) ?? 0) + 1);
      monthSet.add(monthKey(e.date));
      for (const se of e.subEvents) {
        for (const s of se.skillTags) skillCounts.set(s, (skillCounts.get(s) ?? 0) + 1);
        monthSet.add(monthKey(se.date));
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

    return { topSkills, maxSkillCount, distribution, maxDistCount, streak, themes };
  }, [events]);

  return (
    <div className="px-5 pt-6">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Growth Overview</p>
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight">Insights</h1>
      </header>

      <Card className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-accent text-white">
          <Flame size={20} />
        </div>
        <div>
          <p className="text-lg font-semibold leading-tight">{stats.streak} month streak</p>
          <p className="text-xs text-muted">Consecutive months with logged growth</p>
        </div>
      </Card>

      <Card className="mb-4">
        <h2 className="mb-3 text-sm font-semibold">Top Skills</h2>
        <div className="space-y-3">
          {stats.topSkills.map(([skill, count]) => (
            <div key={skill}>
              <div className="mb-1 flex items-center justify-between text-[13px]">
                <span className="font-medium">{skill}</span>
                <span className="text-muted">{count}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-black/5">
                <div
                  className="h-full gradient-accent"
                  style={{ width: `${(count / stats.maxSkillCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {stats.topSkills.length === 0 && <p className="text-sm text-muted">Log events to see your top skills.</p>}
        </div>
      </Card>

      <Card className="mb-4">
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
    </div>
  );
}
