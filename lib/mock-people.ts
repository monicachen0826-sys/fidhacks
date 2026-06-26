export interface MockPerson {
  id: string;
  username: string;
  display_name: string;
  group: "School" | "Friends" | "Work";
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
  { id: "mock-1", username: "jordan_lincoln", display_name: "Jordan Reyes", group: "School" },
  { id: "mock-2", username: "priya_lincolnhs", display_name: "Priya Anand", group: "School" },
  { id: "mock-3", username: "samk", display_name: "Sam Kowalski", group: "School" },
  { id: "mock-4", username: "ava.b", display_name: "Ava Bennett", group: "Friends" },
  { id: "mock-5", username: "theo_m", display_name: "Theo Martinez", group: "Friends" },
  { id: "mock-6", username: "nina_w", display_name: "Nina Walsh", group: "Friends" },
  { id: "mock-7", username: "deepak.v", display_name: "Deepak Verma", group: "Work" },
];
