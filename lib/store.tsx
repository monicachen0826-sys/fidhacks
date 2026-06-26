"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Event, SubEvent } from "@/lib/types";
import { seedEvents } from "@/lib/seed";
import { generateEventSummary, generateSubEventSummary } from "@/lib/ai";

const STORAGE_KEY = "proof-of-skill-ledger";

interface LedgerContextValue {
  events: Event[];
  getEvent: (id: string) => Event | undefined;
  getSubEvent: (eventId: string, subId: string) => SubEvent | undefined;
  addEvent: (input: Omit<Event, "id" | "subEvents" | "aiSummary">) => Event;
  addSubEvent: (eventId: string, input: Omit<SubEvent, "id" | "parentEventId" | "aiSummary">) => SubEvent;
  updateSubEvent: (eventId: string, subId: string, input: Omit<SubEvent, "id" | "parentEventId" | "aiSummary">) => void;
  setVisibility: (eventId: string, visibility: Event["visibility"]) => void;
  setSignificance: (eventId: string, significance: Event["significance"]) => void;
  ready: boolean;
}

const LedgerContext = createContext<LedgerContextValue | null>(null);

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(seedEvents);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
      if (stored) setEvents(JSON.parse(stored));
    } catch {
      // ignore corrupt storage
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events, ready]);

  const getEvent = useCallback((id: string) => events.find((e) => e.id === id), [events]);

  const getSubEvent = useCallback(
    (eventId: string, subId: string) => getEvent(eventId)?.subEvents.find((s) => s.id === subId),
    [getEvent]
  );

  const addEvent = useCallback((input: Omit<Event, "id" | "subEvents" | "aiSummary">) => {
    const event: Event = {
      ...input,
      id: uid("evt"),
      subEvents: [],
      aiSummary: generateEventSummary(input),
    };
    setEvents((prev) => [...prev, event]);
    return event;
  }, []);

  const addSubEvent = useCallback(
    (eventId: string, input: Omit<SubEvent, "id" | "parentEventId" | "aiSummary">) => {
      const sub: SubEvent = {
        ...input,
        id: uid("sub"),
        parentEventId: eventId,
        aiSummary: generateSubEventSummary(input),
      };
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, subEvents: [...e.subEvents, sub] } : e))
      );
      return sub;
    },
    []
  );

  const updateSubEvent = useCallback(
    (eventId: string, subId: string, input: Omit<SubEvent, "id" | "parentEventId" | "aiSummary">) => {
      setEvents((prev) =>
        prev.map((e) =>
          e.id !== eventId
            ? e
            : {
                ...e,
                subEvents: e.subEvents.map((s) =>
                  s.id === subId
                    ? { ...s, ...input, aiSummary: generateSubEventSummary(input) }
                    : s
                ),
              }
        )
      );
    },
    []
  );

  const setVisibility = useCallback((eventId: string, visibility: Event["visibility"]) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, visibility } : e)));
  }, []);

  const setSignificance = useCallback((eventId: string, significance: Event["significance"]) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, significance } : e)));
  }, []);

  const value = useMemo(
    () => ({ events, getEvent, getSubEvent, addEvent, addSubEvent, updateSubEvent, setVisibility, setSignificance, ready }),
    [events, getEvent, getSubEvent, addEvent, addSubEvent, updateSubEvent, setVisibility, setSignificance, ready]
  );

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
}

export function useLedger() {
  const ctx = useContext(LedgerContext);
  if (!ctx) throw new Error("useLedger must be used within LedgerProvider");
  return ctx;
}
