import { createClient, table, isSupabaseConfigured } from "@/lib/supabase/client";
import { DEMO_PROFILE, MOCK_PEOPLE } from "@/lib/mock-people";

export interface ConnectionRow {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: "pending" | "accepted" | "declined";
}

export interface PersonResult {
  id: string;
  username: string;
  display_name: string;
}

interface DemoPersonRef {
  id: string;
  username: string;
  display_name: string;
}

interface DemoConnection {
  id: string;
  status: "pending" | "accepted" | "declined";
  requester: DemoPersonRef;
  recipient: DemoPersonRef;
}

const DEMO_STORAGE_KEY = "demo-connections";

function findDemoPerson(id: string): DemoPersonRef {
  if (id === DEMO_PROFILE.id) return DEMO_PROFILE;
  const person = MOCK_PEOPLE.find((p) => p.id === id);
  return person ?? { id, username: id, display_name: id };
}

function loadDemoConnections(): DemoConnection[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoConnection[]) : [];
  } catch {
    return [];
  }
}

function saveDemoConnections(rows: DemoConnection[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(rows));
}

export async function searchUsers(query: string, excludeId: string): Promise<PersonResult[]> {
  if (!isSupabaseConfigured()) {
    const q = query.toLowerCase();
    return MOCK_PEOPLE.filter(
      (p) =>
        p.id !== excludeId &&
        (p.username.toLowerCase().includes(q) || p.display_name.toLowerCase().includes(q))
    ).map(({ id, username, display_name }) => ({ id, username, display_name }));
  }
  const supabase = createClient();
  const { data } = await table(supabase, "profiles")
    .select("id, username, display_name")
    .ilike("username", `%${query}%`)
    .neq("id", excludeId)
    .limit(10);
  return (data as PersonResult[]) ?? [];
}

export async function sendConnectionRequest(requesterId: string, recipientId: string) {
  if (!isSupabaseConfigured()) {
    const rows = loadDemoConnections();
    rows.push({
      id: `demo-conn-${Date.now()}`,
      status: "pending",
      requester: findDemoPerson(requesterId),
      recipient: findDemoPerson(recipientId),
    });
    saveDemoConnections(rows);
    return { error: null };
  }
  const supabase = createClient();
  return table(supabase, "connections").insert({ requester_id: requesterId, recipient_id: recipientId });
}

export async function respondToRequest(connectionId: string, status: "accepted" | "declined") {
  if (!isSupabaseConfigured()) {
    const rows = loadDemoConnections();
    const row = rows.find((r) => r.id === connectionId);
    if (row) row.status = status;
    saveDemoConnections(rows);
    return { error: null };
  }
  const supabase = createClient();
  return table(supabase, "connections").update({ status }).eq("id", connectionId);
}

export async function listConnections(userId: string) {
  if (!isSupabaseConfigured()) {
    const rows = loadDemoConnections();
    if (userId === DEMO_PROFILE.id && rows.length === 0) {
      const seeded: DemoConnection[] = [
        {
          id: "demo-conn-seed-1",
          status: "pending",
          requester: findDemoPerson("mock-1"),
          recipient: DEMO_PROFILE,
        },
        {
          id: "demo-conn-seed-2",
          status: "accepted",
          requester: DEMO_PROFILE,
          recipient: findDemoPerson("mock-4"),
        },
        {
          id: "demo-conn-seed-3",
          status: "accepted",
          requester: findDemoPerson("mock-10"),
          recipient: DEMO_PROFILE,
        },
        {
          id: "demo-conn-seed-4",
          status: "pending",
          requester: findDemoPerson("mock-14"),
          recipient: DEMO_PROFILE,
        },
        {
          id: "demo-conn-seed-5",
          status: "accepted",
          requester: DEMO_PROFILE,
          recipient: findDemoPerson("mock-7"),
        },
      ];
      saveDemoConnections(seeded);
      return seeded;
    }
    return rows.filter((r) => r.requester.id === userId || r.recipient.id === userId);
  }
  const supabase = createClient();
  const { data } = await table(supabase, "connections")
    .select("*, requester:profiles!connections_requester_id_fkey(id,username,display_name), recipient:profiles!connections_recipient_id_fkey(id,username,display_name)")
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);
  return data ?? [];
}
