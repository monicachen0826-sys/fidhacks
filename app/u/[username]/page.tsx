"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Bubble, getBubbleTone } from "@/components/Bubble";
import { createClient, table, isSupabaseConfigured } from "@/lib/supabase/client";
import { MOCK_PEOPLE, MOCK_EVENTS_BY_PERSON, DEMO_PROFILE } from "@/lib/mock-people";
import type { Category, Significance } from "@/lib/types";

interface RemoteProfile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
}

interface RemoteEvent {
  id: string;
  title: string;
  category: Category;
  date: string;
  significance: Significance;
}

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<RemoteProfile | null>(null);
  const [events, setEvents] = useState<RemoteEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isSupabaseConfigured()) {
        const person =
          username === DEMO_PROFILE.username
            ? DEMO_PROFILE
            : MOCK_PEOPLE.find((p) => p.username === username);
        if (!person) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setProfile(person as RemoteProfile);
        setEvents((MOCK_EVENTS_BY_PERSON[person.id] ?? []) as RemoteEvent[]);
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const { data: person } = await table(supabase, "profiles")
        .select("id, username, display_name, bio")
        .eq("username", username)
        .maybeSingle();
      if (cancelled) return;
      if (!person) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setProfile(person as RemoteProfile);
      const { data: theirEvents } = await table(supabase, "events")
        .select("id, title, category, date, significance")
        .eq("user_id", person.id)
        .order("date", { ascending: false });
      if (!cancelled) {
        setEvents((theirEvents as RemoteEvent[]) ?? []);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  return (
    <div className="min-h-full pb-6">
      <AppHeader title={`@${username}`} showMenu={false} />
      <div className="px-4">
        {loading && <p className="py-12 text-center text-sm text-muted">Loading...</p>}
        {notFound && <p className="py-12 text-center text-sm text-muted">No one found at @{username}.</p>}
        {profile && (
          <>
            <p className="serif-heading text-xl">{profile.display_name || profile.username}</p>
            {profile.bio && <p className="mt-1 text-sm text-muted">{profile.bio}</p>}

            <div className="mt-5 space-y-3">
              {events.length === 0 ? (
                <p className="text-sm text-muted">
                  Nothing visible here yet — events only show up once you&apos;re connected, or if they&apos;re public.
                </p>
              ) : (
                events.map((e) => (
                  <div key={e.id} className="card-surface flex items-center gap-3 p-3">
                    <Bubble category={e.category} significance={Math.min(e.significance, 3) as 1 | 2 | 3} tone={getBubbleTone(e.category, e.id)} />
                    <div>
                      <p className="font-bold">{e.title}</p>
                      <p className="text-[11px] text-muted">
                        {new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
