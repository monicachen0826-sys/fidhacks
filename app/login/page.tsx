"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-store";

export default function LoginPage() {
  const { session, profile, signInWithEmail, completeProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSendLink() {
    if (!email.trim()) return;
    setBusy(true);
    setError(null);
    const { error } = await signInWithEmail(email.trim());
    setBusy(false);
    if (error) setError(error);
    else setSent(true);
  }

  async function handleSaveProfile() {
    if (!username.trim()) return;
    setBusy(true);
    setError(null);
    const { error } = await completeProfile(username.trim().toLowerCase(), displayName.trim());
    setBusy(false);
    if (error) setError(error);
  }

  if (session && !profile) {
    return (
      <div className="flex h-full min-h-[700px] flex-col items-center justify-center px-6 text-center">
        <h1 className="serif-heading text-2xl text-foreground">Pick a username</h1>
        <p className="mt-2 text-sm text-muted">This is how friends will find you to connect.</p>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display name"
          className="mt-6 w-full rounded-2xl glass-dark px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted focus:ring-2 focus:ring-accent/30"
        />
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value.replace(/[^a-z0-9_]/gi, ""))}
          placeholder="username"
          className="mt-3 w-full rounded-2xl glass-dark px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted focus:ring-2 focus:ring-accent/30"
        />
        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
        <button
          type="button"
          disabled={busy || !username.trim()}
          onClick={handleSaveProfile}
          className="mt-6 w-full rounded-full gradient-accent py-3.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {busy ? "Saving..." : "Continue"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[700px] flex-col items-center justify-center px-6 text-center">
      <h1 className="serif-heading text-2xl text-foreground">Sign in to My Multiverse</h1>
      <p className="mt-2 text-sm text-muted">We&apos;ll email you a magic link, no password needed.</p>

      {sent ? (
        <p className="mt-8 text-sm text-accent">Check your inbox for a sign-in link.</p>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-6 w-full rounded-2xl glass-dark px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted focus:ring-2 focus:ring-accent/30"
          />
          {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
          <button
            type="button"
            disabled={busy || !email.trim()}
            onClick={handleSendLink}
            className="mt-6 w-full rounded-full gradient-accent py-3.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {busy ? "Sending..." : "Send magic link"}
          </button>
        </>
      )}
    </div>
  );
}
