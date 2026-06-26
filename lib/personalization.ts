import type { Event } from "@/lib/types";
import type { CopilotPromptKey } from "@/lib/ai";

export interface Goals {
  [id: string]: number;
}

function lean(goals: Goals, id: string, threshold = 55) {
  const value = goals[id] ?? 50;
  if (value >= threshold) return "right" as const;
  if (value <= 100 - threshold) return "left" as const;
  return "neutral" as const;
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

export function defaultInsightsTab(goals: Goals): "skills" | "growth" | "trends" {
  const showcaseLean = lean(goals, "growth-vs-showcase");
  const reflectLean = lean(goals, "reflect-vs-next");

  if (showcaseLean === "right") return "skills";
  if (reflectLean === "right") return "trends";
  return "growth";
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
