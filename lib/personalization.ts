import type { Event, TimelineFilter } from "@/lib/types";
import type { CopilotPromptKey } from "@/lib/ai";
import type { ProfilePreferences } from "@/lib/types";

export interface Goals {
  [id: string]: number;
}

function lean(goals: Goals, id: string, threshold = 55) {
  const value = goals[id] ?? 50;
  if (value >= threshold) return "right" as const;
  if (value <= 100 - threshold) return "left" as const;
  return "neutral" as const;
}

export function applyGoalsToPreferences(goals: Goals): Partial<ProfilePreferences> {
  const showcaseLean = lean(goals, "growth-vs-showcase");
  const collectLean = lean(goals, "collect-vs-polish");
  const shortLean = lean(goals, "short-vs-long");

  return {
    showFrequencyOnInsights: lean(goals, "growth-vs-showcase", 50) !== "right",
    compactTimeline: collectLean === "right",
    defaultTimelineFilter:
      showcaseLean === "right" ? "professional" : collectLean === "left" ? "all" : "all",
  };
}

export function sortEventsForDashboard(events: Event[], goals: Goals): Event[] {
  const polishLean = lean(goals, "collect-vs-polish");
  const showcaseLean = lean(goals, "growth-vs-showcase");

  return [...events].sort((a, b) => {
    if (polishLean === "right") {
      if (a.significance !== b.significance) return b.significance - a.significance;
    }
    if (showcaseLean === "right") {
      const aPortfolio = a.visibility === "portfolio" ? 1 : 0;
      const bPortfolio = b.visibility === "portfolio" ? 1 : 0;
      if (aPortfolio !== bPortfolio) return bPortfolio - aPortfolio;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function dashboardSubtitle(goals: Goals): string {
  const polishLean = lean(goals, "collect-vs-polish");
  const showcaseLean = lean(goals, "growth-vs-showcase");

  if (polishLean === "right" && showcaseLean === "right") return "Your best moments, ready to show.";
  if (polishLean === "right") return "Your best moments, polished.";
  if (showcaseLean === "right") return "What you can show others.";
  if (polishLean === "left") return "Every experience, all in one place.";
  return "Your life. Visualized.";
}

export function defaultInsightsTab(goals: Goals): "skills" | "growth" | "trends" | "frequency" {
  const showcaseLean = lean(goals, "growth-vs-showcase");
  const reflectLean = lean(goals, "reflect-vs-next");
  const growthLean = lean(goals, "growth-vs-showcase", 50);

  if (growthLean === "left") return "frequency";
  if (showcaseLean === "right") return "skills";
  if (reflectLean === "right") return "trends";
  return "growth";
}

export function defaultEventTab(goals: Goals): "overview" | "microwins" | "notes" {
  const detailsLean = lean(goals, "details-vs-summaries");
  return detailsLean === "left" ? "microwins" : "overview";
}

export function suggestedPromptsFromChecklist(checklist: Record<string, boolean>): string[] {
  const map: Record<string, string> = {
    "made-something": "Log a project you built for class or work",
    "taught-someone": "Capture a time you taught someone something",
    "fixed-mess": "Add a moment you fixed a messy process or plan",
    "applied-somewhere": "Log an application — even if you didn't get it",
    "positive-feedback": "Save positive feedback you received",
    "learned-tool": "Record a tool you learned out of necessity",
    "ran-event": "Add an event, meeting, or activity you helped run",
    "handled-responsibility": "Log responsibility you handled at home, work, or school",
    "made-from-curiosity": "Capture something you made just because you were curious",
  };
  return Object.entries(checklist)
    .filter(([, checked]) => checked)
    .map(([id]) => map[id])
    .filter(Boolean);
}

const COPILOT_PRIORITY: Record<CopilotPromptKey, { reflect: number; next: number }> = {
  "reflect": { reflect: 2, next: 0 },
  "summarize-growth": { reflect: 1, next: 0 },
  "connect-growth": { reflect: 1, next: 1 },
  "strongest-skills": { reflect: 0, next: 1 },
  "resume-language": { reflect: 0, next: 2 },
};

export function sortCopilotPrompts<T extends { key: CopilotPromptKey }>(prompts: T[], goals: Goals): T[] {
  const reflectLean = lean(goals, "reflect-vs-next");
  return [...prompts].sort((a, b) => {
    const priority = reflectLean === "left" ? "reflect" : reflectLean === "right" ? "next" : null;
    if (!priority) return 0;
    return COPILOT_PRIORITY[b.key][priority] - COPILOT_PRIORITY[a.key][priority];
  });
}
