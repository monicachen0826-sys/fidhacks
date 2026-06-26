import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function createClient() {
  if (client) return client;
  client = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return client;
}

// No generated Database types yet, so table rows fall back to `never`
// under strict mode. Use this for inserts/updates/selects until schema
// types are generated with `supabase gen types`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function table(client: SupabaseClient, name: string): any {
  return client.from(name);
}
