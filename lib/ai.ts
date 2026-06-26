import type { Event, SubEvent } from "@/lib/types";

const OPENERS = [
  "This moment marked real growth.",
  "A clear step forward in the journey.",
  "Worth remembering — this is what progress looks like.",
  "A small win that built real momentum.",
];

function pick<T>(arr: T[], seed: string): T {
  const idx = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % arr.length;
  return arr[idx];
}

export function generateEventSummary(event: Pick<Event, "title" | "description" | "skills" | "category">): string {
  const opener = pick(OPENERS, event.title);
  const skillsPhrase = event.skills.length
    ? `It drew on ${event.skills.slice(0, 3).join(", ")}.`
    : "";
  return `${opener} "${event.title}" — ${event.description.trim().replace(/\.$/, "")}. ${skillsPhrase} This belongs in the ${event.category === "both" ? "personal and professional" : event.category} story of the journey.`.trim();
}

export function generateSubEventSummary(sub: Pick<SubEvent, "title" | "description" | "whyItMattered" | "skillTags">): string {
  const opener = pick(OPENERS, sub.title);
  const why = sub.whyItMattered ? ` ${sub.whyItMattered.trim().replace(/\.$/, "")}.` : "";
  const skillsPhrase = sub.skillTags.length
    ? ` It's evidence of growing ${sub.skillTags.slice(0, 3).join(", ")}.`
    : "";
  return `${opener} ${sub.description.trim().replace(/\.$/, "")}.${why}${skillsPhrase}`.trim();
}

export type CopilotPromptKey =
  | "summarize-growth"
  | "strongest-skills"
  | "resume-language"
  | "connect-growth"
  | "reflect";

export const COPILOT_PROMPTS: { key: CopilotPromptKey; label: string }[] = [
  { key: "summarize-growth", label: "Summarize my growth" },
  { key: "strongest-skills", label: "Identify my strongest skills" },
  { key: "resume-language", label: "Turn this into resume language" },
  { key: "connect-growth", label: "Connect my personal and professional growth" },
  { key: "reflect", label: "Help me reflect" },
];

export function generateCopilotResponse(
  key: CopilotPromptKey,
  events: Event[]
): string {
  const skillCounts = new Map<string, number>();
  for (const e of events) {
    for (const s of e.skills) skillCounts.set(s, (skillCounts.get(s) ?? 0) + 1);
    for (const se of e.subEvents) for (const s of se.skillTags) skillCounts.set(s, (skillCounts.get(s) ?? 0) + 1);
  }
  const topSkills = [...skillCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([s]) => s);
  const big = events.filter((e) => e.significance >= 4);
  const personal = events.filter((e) => e.category === "personal" || e.category === "both");
  const professional = events.filter((e) => e.category === "professional" || e.category === "both");

  switch (key) {
    case "summarize-growth":
      return `Across ${events.length} logged events, you've shown consistent growth — especially in ${topSkills.join(", ") || "several emerging areas"}. Highlights like ${big.map((e) => `"${e.title}"`).slice(0, 3).join(", ") || "your recent entries"} show a pattern of taking on challenges and following through.`;
    case "strongest-skills":
      return topSkills.length
        ? `Your strongest demonstrated skills right now are ${topSkills.join(", ")} — each shows up across multiple events and micro-wins, not just once.`
        : "Log a few more events and I'll be able to spot your strongest recurring skills.";
    case "resume-language":
      return big
        .slice(0, 3)
        .map((e) => `• ${e.title}: Demonstrated ${e.skills.slice(0, 2).join(" and ") || "initiative"} by ${e.description.trim().replace(/\.$/, "").toLowerCase()}.`)
        .join("\n") || "Add a few high-significance events to generate resume bullet points.";
    case "connect-growth":
      return `Your personal growth (${personal.length} events, e.g. ${personal[0]?.title ?? "—"}) and professional growth (${professional.length} events, e.g. ${professional[0]?.title ?? "—"}) reinforce each other — the resilience and discipline built personally show up directly in how you handle professional challenges.`;
    case "reflect":
      return "Take a moment: which of these moments surprised you most about yourself? Growth often hides in the events you almost didn't log — the messy middle, not just the win at the end.";
  }
}
