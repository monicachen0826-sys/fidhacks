import type { DayActivity, Event, TopicFrequency } from "@/lib/types";

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function getAllTopics(events: Event[]): string[] {
  const topics = new Set<string>();
  for (const e of events) {
    for (const s of e.skills) topics.add(s);
    for (const se of e.subEvents) {
      for (const t of se.skillTags) topics.add(t);
    }
  }
  return [...topics].sort((a, b) => a.localeCompare(b));
}

function countForTopicOnDate(events: Event[], topic: string, key: string): number {
  let count = 0;
  for (const e of events) {
    if (e.date.slice(0, 10) === key && e.skills.includes(topic)) count += 1;
    for (const se of e.subEvents) {
      if (se.date.slice(0, 10) === key && se.skillTags.includes(topic)) count += 1;
    }
  }
  return count;
}

function computeStreaks(days: DayActivity[]): { current: number; longest: number } {
  const active = new Set(days.filter((d) => d.count > 0).map((d) => d.date));
  if (active.size === 0) return { current: 0, longest: 0 };

  let longest = 0;
  let run = 0;
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  for (const day of sorted) {
    if (day.count > 0) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }

  let current = 0;
  const cursor = new Date();
  while (true) {
    const key = dateKey(cursor);
    if (active.has(key)) {
      current += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }

  return { current, longest };
}

export function getTopicFrequency(events: Event[], topic: string, weeks = 12): TopicFrequency {
  const days: DayActivity[] = [];
  const totalDays = weeks * 7;
  const start = new Date();
  start.setDate(start.getDate() - totalDays + 1);

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = dateKey(d);
    days.push({ date: key, count: countForTopicOnDate(events, topic, key) });
  }

  const { current, longest } = computeStreaks(days);
  const totalEntries = days.reduce((sum, d) => sum + d.count, 0);

  return { topic, days, currentStreak: current, longestStreak: longest, totalEntries };
}

export function getTopTopicFrequencies(events: Event[], limit = 4, weeks = 12): TopicFrequency[] {
  const topics = getAllTopics(events);
  const counts = topics.map((topic) => {
    const freq = getTopicFrequency(events, topic, weeks);
    return { topic, total: freq.totalEntries, freq };
  });
  return counts
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
    .map((c) => c.freq);
}
