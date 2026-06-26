"use client";

import { useMemo, useState } from "react";
import { Flame, TrendingUp } from "lucide-react";
import { useLedger } from "@/lib/store";
import { AppHeader } from "@/components/AppHeader";
import { SegmentedControl } from "@/components/SegmentedControl";

type InsightTab = "skills" | "growth" | "trends";

const SKILL_COLORS = ["#6347d9", "#4f7cff", "#34c8e8", "#34d399", "#ff7a8a", "#f97316"];

function monthKey(date: string) {
  return date.slice(0, 7);
}

export default function InsightsPage() {
  const { events } = useLedger();
  const [tab, setTab] = useState<InsightTab>("skills");

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

    const recent = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
    const themes = [...new Set(recent.flatMap((e) => e.skills))].slice(0, 8);

    return { topSkills, maxSkillCount, distribution, maxDistCount, streak, themes, recent };
  }, [events]);

  const tabOptions: { value: InsightTab; label: string }[] = [
    { value: "skills", label: "Skills" },
    { value: "growth", label: "Growth" },
    { value: "trends", label: "Trends" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader title="Insights" showMenu={false} />

      <div className="px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Insights</h2>
          <p className="mt-0.5 text-sm text-muted">Track your skill growth over time.</p>
        </div>

        <SegmentedControl options={tabOptions} value={tab} onChange={setTab} />

        <div className="mt-6">
          {tab === "skills" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold">Skill Growth</h3>
                  <button type="button" className="text-xs font-semibold text-accent">
                    View All Skills
                  </button>
                </div>
                <div className="space-y-4">
                  {stats.topSkills.map(([skill, count], i) => {
                    const pct = Math.round((count / stats.maxSkillCount) * 100);
                    const color = SKILL_COLORS[i % SKILL_COLORS.length];
                    return (
                      <div key={skill}>
                        <div className="mb-1.5 flex items-center justify-between text-[13px]">
                          <span className="font-semibold">{skill}</span>
                          <span className="font-bold text-accent">{pct}%</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/5">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {stats.topSkills.length === 0 && (
                    <p className="text-sm text-muted">Log events to see your top skills.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "growth" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-accent text-white">
                  <Flame size={20} />
                </div>
                <div>
                  <p className="text-lg font-bold leading-tight">{stats.streak} month streak</p>
                  <p className="text-xs text-muted">Consecutive months with logged growth</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <h3 className="mb-4 text-sm font-bold">Impact Distribution</h3>
                <div className="flex h-32 items-end justify-between gap-2">
                  {stats.distribution.map((d) => (
                    <div key={d.level} className="flex flex-1 flex-col items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-muted">{d.count}</span>
                      <div className="flex h-24 w-full items-end">
                        <div
                          className="w-full rounded-t-lg gradient-professional"
                          style={{ height: `${(d.count / stats.maxDistCount) * 100}%`, minHeight: d.count ? 8 : 0 }}
                        />
                      </div>
                      <span className="text-[11px] text-muted">L{d.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "trends" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp size={16} className="text-accent" />
                  <h3 className="text-sm font-bold">Recent Growth Themes</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stats.themes.length === 0 ? (
                    <p className="text-sm text-muted">No recent themes yet.</p>
                  ) : (
                    stats.themes.map((t) => (
                      <span key={t} className="rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-medium text-accent">
                        {t}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-bold">Recent Moments</h3>
                <div className="space-y-3">
                  {stats.recent.map((e) => (
                    <div key={e.id} className="flex items-center justify-between rounded-xl bg-black/[0.02] px-3 py-2.5">
                      <div>
                        <p className="text-sm font-semibold">{e.title}</p>
                        <p className="text-xs text-muted">{e.skills.slice(0, 2).join(" · ")}</p>
                      </div>
                      <span className="text-xs font-medium text-accent">L{e.significance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
