"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { UserPlus, Check, X } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/lib/auth-store";
import { searchUsers, sendConnectionRequest, respondToRequest, listConnections, type PersonResult } from "@/lib/connections";

interface ConnectionRecord {
  id: string;
  status: "pending" | "accepted" | "declined";
  requester: { id: string; username: string; display_name: string };
  recipient: { id: string; username: string; display_name: string };
}

export default function ConnectionsPage() {
  const { profile } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PersonResult[]>([]);
  const [connections, setConnections] = useState<ConnectionRecord[]>([]);
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    if (!profile) return;
    const rows = await listConnections(profile.id);
    setConnections(rows as unknown as ConnectionRecord[]);
  }, [profile]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!profile || query.trim().length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setResults(await searchUsers(query.trim(), profile.id));
    }, 250);
    return () => clearTimeout(t);
  }, [query, profile]);

  if (!profile) return null;

  const incoming = connections.filter((c) => c.status === "pending" && c.recipient.id === profile.id);
  const accepted = connections.filter((c) => c.status === "accepted");

  async function handleRequest(personId: string) {
    if (!profile) return;
    await sendConnectionRequest(profile.id, personId);
    setSentTo((prev) => new Set(prev).add(personId));
  }

  async function handleRespond(connectionId: string, status: "accepted" | "declined") {
    await respondToRequest(connectionId, status);
    refresh();
  }

  return (
    <div className="min-h-full pb-6">
      <AppHeader title="Connections" showMenu={false} />
      <div className="px-4">
        <h2 className="serif-heading mb-4 text-2xl">Connections</h2>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username..."
          className="w-full rounded-2xl glass-dark px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted focus:ring-2 focus:ring-accent/30"
        />

        {results.length > 0 && (
          <div className="mt-3 space-y-2">
            {results.map((person) => {
              const alreadyConnected = accepted.some(
                (c) => c.requester.id === person.id || c.recipient.id === person.id
              );
              const pendingSent = sentTo.has(person.id) || connections.some(
                (c) => c.status === "pending" && (c.requester.id === person.id || c.recipient.id === person.id)
              );
              return (
                <div key={person.id} className="card-surface flex items-center justify-between p-3">
                  <div>
                    <p className="text-sm font-bold">{person.display_name || person.username}</p>
                    <p className="text-[11px] text-muted">@{person.username}</p>
                  </div>
                  {alreadyConnected ? (
                    <span className="text-[11px] text-accent">Connected</span>
                  ) : pendingSent ? (
                    <span className="text-[11px] text-muted">Pending</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRequest(person.id)}
                      className="flex items-center gap-1 rounded-full gradient-accent px-3 py-1.5 text-[11px] font-bold text-white"
                    >
                      <UserPlus size={12} /> Connect
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {incoming.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Requests</h3>
            <div className="space-y-2">
              {incoming.map((c) => (
                <div key={c.id} className="card-surface flex items-center justify-between p-3">
                  <div>
                    <p className="text-sm font-bold">{c.requester.display_name || c.requester.username}</p>
                    <p className="text-[11px] text-muted">@{c.requester.username}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRespond(c.id, "accepted")}
                      className="flex h-7 w-7 items-center justify-center rounded-full gradient-accent text-white"
                      aria-label="Accept"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRespond(c.id, "declined")}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-black/10 text-muted"
                      aria-label="Decline"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Your connections</h3>
          {accepted.length === 0 ? (
            <p className="text-sm text-muted">No connections yet. Search a username above to send a request.</p>
          ) : (
            <div className="space-y-2">
              {accepted.map((c) => {
                const other = c.requester.id === profile.id ? c.recipient : c.requester;
                return (
                  <Link key={c.id} href={`/u/${other.username}`} className="card-surface flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm font-bold">{other.display_name || other.username}</p>
                      <p className="text-[11px] text-muted">@{other.username}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
