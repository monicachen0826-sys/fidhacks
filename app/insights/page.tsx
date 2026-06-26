"use client";

import { useMemo, useState } from "react";
import { Flame, TrendingUp } from "lucide-react";
import { useLedger } from "@/lib/store";
import { AppHeader } from "@/components/AppHeader";
import { SegmentedControl } from "@/components/SegmentedControl";

type InsightTab = "skills" | "growth" | "trends";
const SKILL_COLORS = ["#7c3aed", "#38bdf8", "#2dd4bf", "#34d399", "#f97316", "#ec4899"];

export default function InsightsPage() {
  const { events } = useLedger();
  const [tab, setTab] = useState<InsightTab>("skills");

  const stats = useMemo(() => {
    const skillCounts = new Map<string, number>();
    const monthSet = new Set<string>();
    for (const e of events) {
      for (const s of e.skills) skillCounts.set(s, (skillCounts.get(s) ?? 0) + 1);
      monthSet.add(e.date.slice(0, 7));
      for (const se of e.subEvents) {
        for (const s of se.skillTags) skillCounts.set(s, (skillCounts.get(s) ?? 0) + 1);
        monthSet.add(se.date.slice(0, 7));
      }
    }
    const topSkills = [...skillCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxSkillCount = topSkills[0]?.[1] ?? 1;
    let streak = 0;
    const cursor = new Date();
    while (monthSet.has(cursor.toISOString().slice(0, 7))) {
      streak += 1;
      cursor.setMonth(cursor.getMonth() - 1);
    }
    const themes = [...new Set(events.flatMap((e) => e.skills))].slice(0, 8);
    return { topSkills, maxSkillCount, streak, themes };
  }, [events]);

  const tabOptions = [
    { value: "skills" as const, label: "Skills" },
    { value: "growth" as const, label: "Growth" },
    { value: "trends" as const, label: "Trends" },
  ];

  return (
    <div className="min-h-full pb-6">
      <AppHeader title="Insights" showMenu={false} />
      <div className="px-4">
        <h2 className="serif-heading mb-4 text-2xl">Insights</h2>
        <SegmentedControl options={tabOptions} value={tab} onChange={setTab} />

        <div className="mt-5 space-y-4">
          {tab === "skills" && (
            <div className="card-surface p-4">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted">Skill Growth</h3>
              <div className="space-y-4">
                {stats.topSkills.map(([skill, count], i) => {
                  const pct = Math.round((count / stats.maxSkillCount) * 100);
                  return (
                    <div key={skill}>
                      <div className="mb-1.5 flex justify-between text-[13px]">
                        <span className="font-semibold">{skill}</span>
                        <span className="font-bold text-accent">{pct}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/5">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: SKILL_COLORS[i % SKILL_COLORS.length] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "growth" && (
            <div className="card-surface flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-accent text-white">
                <Flame size={20} />
              </div>
              <div>
                <p className="text-lg font-bold">{stats.streak} month streak</p>
                <p className="text-xs text-muted">Consecutive months with logged growth</p>
              </div>
            </div>
          )}

          {tab === "trends" && (
            <div className="card-surface p-4">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-accent" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Themes</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {stats.themes.map((t) => (
                  <span key={t} className="rounded-full bg-accent/15 px-3 py-1 text-[12px] font-medium text-accent">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
