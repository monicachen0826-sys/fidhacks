export interface ChecklistItem {
  id: string;
  label: string;
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "made-something", label: "You made a presentation, video, website, etc. for a class or project." },
  { id: "taught-someone", label: "You taught someone how to do something." },
  { id: "fixed-mess", label: "You fixed a messy process, schedule, file, or plan." },
  { id: "applied-somewhere", label: "You applied somewhere even if you didn't get it." },
  { id: "positive-feedback", label: "You received positive feedback from a teacher, coach, boss, customer, or teammate." },
  { id: "learned-tool", label: "You learned a tool because you needed it for something." },
  { id: "ran-event", label: "You helped run an event, meeting, fundraiser, or activity." },
  { id: "handled-responsibility", label: "You handled responsibility at home, work, school, or in a community." },
  { id: "made-from-curiosity", label: "You made something just because you were curious or to challenge yourself." },
];

export interface GoalSlider {
  id: string;
  left: string;
  right: string;
}

export const GOAL_SLIDERS: GoalSlider[] = [
  { id: "collect-vs-polish", left: "I want to collect and view everything first", right: "I want to polish my best moments" },
  { id: "specific-vs-exploring", left: "I'm building toward a specific opportunity", right: "I'm still figuring out what I'd like to work on" },
  { id: "short-vs-long", left: "I want short-term goals", right: "I want broader, longer-term goals" },
  { id: "details-vs-summaries", left: "I want to remember details", right: "I want to turn things into clear summaries" },
  { id: "growth-vs-showcase", left: "I want to see how I'm growing", right: "I want to see what I can show others" },
  { id: "reflect-vs-next", left: "I want to make more sense of past experiences", right: "I want to see what to do next" },
];
