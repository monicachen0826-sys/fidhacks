"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient, table, isSupabaseConfigured } from "@/lib/supabase/client";
import { DEMO_PROFILE } from "@/lib/mock-people";

interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  website_url: string;
}

interface AuthContextValue {
  ready: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  completeProfile: (username: string, displayName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(
    isSupabaseConfigured() ? null : DEMO_PROFILE
  );

  async function loadProfile(userId: string) {
    const supabase = createClient();
    const { data } = await table(supabase, "profiles").select("*").eq("id", userId).maybeSingle();
    setProfile((data as unknown as Profile) ?? null);
  }

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setReady(true);
      return;
    }
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session) await loadProfile(data.session.user.id);
      setReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession) await loadProfile(newSession.user.id);
      else setProfile(null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function signInWithEmail(email: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined },
    });
    return { error: error?.message ?? null };
  }

  async function completeProfile(username: string, displayName: string) {
    const supabase = createClient();
    if (!session) return { error: "Not signed in" };
    const { error } = await table(supabase, "profiles").upsert({
      id: session.user.id,
      username,
      display_name: displayName,
    });
    if (!error) await loadProfile(session.user.id);
    return { error: error?.message ?? null };
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  async function refreshProfile() {
    if (session) await loadProfile(session.user.id);
  }

  return (
    <AuthContext.Provider
      value={{
        ready,
        session,
        user: session?.user ?? null,
        profile,
        signInWithEmail,
        completeProfile,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
