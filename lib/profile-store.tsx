"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ProfilePreferences, ProjectSummary, UserProfile } from "@/lib/types";

const STORAGE_KEY = "ledger-profile";

export const DEFAULT_PROFILE: UserProfile = {
  name: "",
  bio: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  websiteUrl: "",
  projectSummaries: [],
  preferences: {
    accentTheme: "purple",
    defaultTimelineFilter: "all",
    showFrequencyOnInsights: true,
    compactTimeline: false,
  },
};

interface ProfileContextValue {
  profile: UserProfile;
  ready: boolean;
  updateProfile: (patch: Partial<UserProfile>) => void;
  updatePreferences: (patch: Partial<ProfilePreferences>) => void;
  addProject: (project: Omit<ProjectSummary, "id">) => void;
  updateProject: (id: string, patch: Partial<ProjectSummary>) => void;
  removeProject: (id: string) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

function uid() {
  return `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(stored) });
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile, ready]);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const updatePreferences = useCallback((patch: Partial<ProfilePreferences>) => {
    setProfile((prev) => ({ ...prev, preferences: { ...prev.preferences, ...patch } }));
  }, []);

  const addProject = useCallback((project: Omit<ProjectSummary, "id">) => {
    setProfile((prev) => ({
      ...prev,
      projectSummaries: [...prev.projectSummaries, { ...project, id: uid() }],
    }));
  }, []);

  const updateProject = useCallback((id: string, patch: Partial<ProjectSummary>) => {
    setProfile((prev) => ({
      ...prev,
      projectSummaries: prev.projectSummaries.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setProfile((prev) => ({
      ...prev,
      projectSummaries: prev.projectSummaries.filter((p) => p.id !== id),
    }));
  }, []);

  const value = useMemo(
    () => ({ profile, ready, updateProfile, updatePreferences, addProject, updateProject, removeProject }),
    [profile, ready, updateProfile, updatePreferences, addProject, updateProject, removeProject]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
