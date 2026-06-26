"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "ledger-onboarding";

interface OnboardingState {
  completed: boolean;
  checklist: Record<string, boolean>;
  goals: Record<string, number>;
}

const DEFAULT_STATE: OnboardingState = { completed: false, checklist: {}, goals: {} };

interface OnboardingContextValue extends OnboardingState {
  ready: boolean;
  toggleChecklistItem: (id: string) => void;
  setGoalValue: (id: string, value: number) => void;
  complete: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
      if (stored) setState(JSON.parse(stored));
    } catch {
      // ignore corrupt storage
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const toggleChecklistItem = useCallback((id: string) => {
    setState((prev) => ({ ...prev, checklist: { ...prev.checklist, [id]: !prev.checklist[id] } }));
  }, []);

  const setGoalValue = useCallback((id: string, value: number) => {
    setState((prev) => ({ ...prev, goals: { ...prev.goals, [id]: value } }));
  }, []);

  const complete = useCallback(() => {
    setState((prev) => ({ ...prev, completed: true }));
  }, []);

  const value = useMemo(
    () => ({ ...state, ready, toggleChecklistItem, setGoalValue, complete }),
    [state, ready, toggleChecklistItem, setGoalValue, complete]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
