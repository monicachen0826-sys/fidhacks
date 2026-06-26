"use client";

import { useMemo, useState } from "react";
import { Flame, TrendingUp, Activity } from "lucide-react";
import { useLedger } from "@/lib/store";
import { useOnboarding } from "@/lib/onboarding-store";
import { useProfile } from "@/lib/profile-store";
import { defaultInsightsTab } from "@/lib/personalization";
import { getAllTopics, getTopicFrequency, getTopTopicFrequencies } from "@/lib/frequency";
import { AppHeader } from "@/components/AppHeader";
import { SegmentedControl } from "@/components/SegmentedControl";
import { FrequencyGrid } from "@/components/FrequencyGrid";

type InsightTab = "skills" | "growth" | "trends" | "frequency";
const SKILL_COLORS = ["#7c3aed", "#38bdf8", "#2dd4bf", "#34d399", "#f97316", "#ec4899"];

export default function InsightsPage() {
  const { events } = useLedger();
  const { goals } = useOnboarding();
  const { profile } = useProfile();
  const [tab, setTab] = useState<InsightTab>(defaultInsightsTab(goals));
  const [selectedTopic, setSelectedTopic] = useState<string>("");

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
    const topics = getAllTopics(events);
    const topFreq = getTopTopicFrequencies(events, 4);
    return { topSkills, maxSkillCount, streak, themes, topics, topFreq };
  }, [events]);

  const activeTopic = selectedTopic || stats.topics[0] || "";
  const topicFreq = useMemo(
    () => (activeTopic ? getTopicFrequency(events, activeTopic) : null),
    [events, activeTopic]
  );

  const tabOptions = [
    { value: "skills" as const, label: "Skills" },
    { value: "growth" as const, label: "Growth" },
    { value: "trends" as const, label: "Trends" },
    ...(profile.preferences.showFrequencyOnInsights ? [{ value: "frequency" as const, label: "Frequency" }] : []),
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
                      <div className="h-2 overflow-hidden rounded-full bg-black/5">
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

          {tab === "frequency" && profile.preferences.showFrequencyOnInsights && (
            <>
              {stats.topFreq.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {stats.topFreq.map((f) => (
                    <button
                      key={f.topic}
                      type="button"
                      onClick={() => { setSelectedTopic(f.topic); }}
                      className="card-surface p-3 text-left"
                    >
                      <p className="truncate text-sm font-bold">{f.topic}</p>
                      <p className="text-[11px] text-muted">{f.currentStreak} day streak · {f.totalEntries} entries</p>
                    </button>
                  ))}
                </div>
              )}

              {topicFreq && (
                <div className="card-surface p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Activity size={14} className="text-accent" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted">{topicFreq.topic} activity</h3>
                  </div>
                  <div className="mb-3 flex gap-4 text-[11px] text-muted">
                    <span><strong className="text-foreground">{topicFreq.currentStreak}</strong> day streak</span>
                    <span><strong className="text-foreground">{topicFreq.longestStreak}</strong> best</span>
                    <span><strong className="text-foreground">{topicFreq.totalEntries}</strong> total</span>
                  </div>
                  <FrequencyGrid days={topicFreq.days} />
                  {stats.topics.length > 1 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {stats.topics.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTopic(t)}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${t === activeTopic ? "gradient-accent text-white" : "glass-dark text-muted"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {stats.topics.length === 0 && (
                <div className="card-surface p-6 text-center text-sm text-muted">
                  Add events with skill tags to see topic frequency charts.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
