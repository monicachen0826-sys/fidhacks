import { createClient, table } from "@/lib/supabase/client";

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

export async function searchUsers(query: string, excludeId: string): Promise<PersonResult[]> {
  const supabase = createClient();
  const { data } = await table(supabase, "profiles")
    .select("id, username, display_name")
    .ilike("username", `%${query}%`)
    .neq("id", excludeId)
    .limit(10);
  return (data as PersonResult[]) ?? [];
}

export async function sendConnectionRequest(requesterId: string, recipientId: string) {
  const supabase = createClient();
  return table(supabase, "connections").insert({ requester_id: requesterId, recipient_id: recipientId });
}

export async function respondToRequest(connectionId: string, status: "accepted" | "declined") {
  const supabase = createClient();
  return table(supabase, "connections").update({ status }).eq("id", connectionId);
}

export async function listConnections(userId: string) {
  const supabase = createClient();
  const { data } = await table(supabase, "connections")
    .select("*, requester:profiles!connections_requester_id_fkey(id,username,display_name), recipient:profiles!connections_recipient_id_fkey(id,username,display_name)")
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);
  return data ?? [];
}
