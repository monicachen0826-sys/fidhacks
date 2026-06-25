export type Category = "professional" | "personal" | "both";
export type Visibility = "private" | "portfolio";
export type Significance = 1 | 2 | 3 | 4 | 5;

export interface SubEvent {
  id: string;
  parentEventId: string;
  title: string;
  date: string;
  description: string;
  whyItMattered?: string;
  significance: Significance;
  skillTags: string[];
  aiSummary?: string;
  evidenceUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  category: Category;
  date: string;
  description: string;
  significance: Significance;
  visibility: Visibility;
  skills: string[];
  subEvents: SubEvent[];
  aiSummary?: string;
}

export type TimelineFilter = "all" | "professional" | "personal" | "portfolio";
