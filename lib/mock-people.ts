export interface MockPerson {
  id: string;
  username: string;
  display_name: string;
  group: "School" | "Friends" | "Work";
  bio: string;
}

export const DEMO_PROFILE = {
  id: "demo-user",
  username: "you",
  display_name: "You",
  bio: "",
  linkedin_url: "",
  github_url: "",
  portfolio_url: "",
  website_url: "",
};

export const MOCK_PEOPLE: MockPerson[] = [
  { id: "mock-1", username: "jordan_lincoln", display_name: "Jordan Reyes", group: "School", bio: "Lincoln High '24. Robotics club captain." },
  { id: "mock-2", username: "priya_lincolnhs", display_name: "Priya Anand", group: "School", bio: "Lincoln High '24. Debate team, future lawyer." },
  { id: "mock-3", username: "samk", display_name: "Sam Kowalski", group: "School", bio: "Lincoln High '24. Plays varsity soccer." },
  { id: "mock-4", username: "ava.b", display_name: "Ava Bennett", group: "Friends", bio: "Met at summer camp. Loves photography." },
  { id: "mock-5", username: "theo_m", display_name: "Theo Martinez", group: "Friends", bio: "Childhood friend, now studying CS." },
  { id: "mock-6", username: "nina_w", display_name: "Nina Walsh", group: "Friends", bio: "Neighbor and travel buddy." },
  { id: "mock-7", username: "deepak.v", display_name: "Deepak Verma", group: "Work", bio: "Internship mentor at ABC Corp." },
  { id: "mock-8", username: "maya_lincoln", display_name: "Maya Chen", group: "School", bio: "Lincoln High '25. Runs the art club." },
  { id: "mock-9", username: "carlos_hs", display_name: "Carlos Diaz", group: "School", bio: "Lincoln High '24. Marching band drummer." },
  { id: "mock-10", username: "ellie.t", display_name: "Ellie Thompson", group: "Friends", bio: "Best friend since middle school." },
  { id: "mock-11", username: "marcus_j", display_name: "Marcus Johnson", group: "Friends", bio: "Gym buddy, training for a 10k." },
  { id: "mock-12", username: "sofia_r", display_name: "Sofia Rivera", group: "Friends", bio: "Roommate freshman year." },
  { id: "mock-13", username: "liam.k", display_name: "Liam Kim", group: "Work", bio: "Coworker on the marketing team." },
  { id: "mock-14", username: "zoe_lincoln", display_name: "Zoe Patel", group: "School", bio: "Lincoln High '24. Student council president." },
];

export interface MockEvent {
  id: string;
  title: string;
  category: "professional" | "personal";
  date: string;
  significance: 1 | 2 | 3 | 4 | 5;
}

export const MOCK_EVENTS_BY_PERSON: Record<string, MockEvent[]> = {
  "mock-1": [
    { id: "mock-1-e1", title: "Won regional robotics competition", category: "professional", date: "2025-03-10", significance: 3 },
    { id: "mock-1-e2", title: "Started a internship at a robotics lab", category: "professional", date: "2025-06-01", significance: 2 },
  ],
  "mock-4": [
    { id: "mock-4-e1", title: "Gallery showing for photography series", category: "personal", date: "2025-04-22", significance: 3 },
  ],
  "mock-8": [
    { id: "mock-8-e1", title: "Art club mural unveiled at school", category: "personal", date: "2025-05-15", significance: 2 },
  ],
  "mock-14": [
    { id: "mock-14-e1", title: "Elected student council president", category: "professional", date: "2025-02-01", significance: 3 },
  ],
};
