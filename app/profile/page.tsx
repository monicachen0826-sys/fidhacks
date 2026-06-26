"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Code, Globe, Link2, Plus, Trash2, ExternalLink } from "lucide-react";
import { useProfile } from "@/lib/profile-store";
import { useOnboarding } from "@/lib/onboarding-store";
import { SegmentedControl } from "@/components/SegmentedControl";
import type { AccentTheme, TimelineFilter } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProfileTab = "connect" | "projects" | "customize";

function SocialLink({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const href = value.startsWith("http") ? value : value ? `https://${value}` : "";

  return (
    <div className="card-surface p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted">
        <Icon size={14} />
        {label}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-xl bg-black/5 px-3 py-2 text-sm outline-none placeholder:text-muted"
        />
        {href && (
          <a href={href} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full glass-dark text-accent">
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { profile, updateProfile, updatePreferences, addProject, updateProject, removeProject } = useProfile();
  const { reset: resetOnboarding } = useOnboarding();
  const [tab, setTab] = useState<ProfileTab>("connect");
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "" });

  const initials = profile.name
    ? profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "M";

  function handleAddProject() {
    if (!newProject.title.trim()) return;
    addProject({
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      link: newProject.link.trim() || undefined,
    });
    setNewProject({ title: "", description: "", link: "" });
  }

  const tabOptions = [
    { value: "connect" as const, label: "Connect" },
    { value: "projects" as const, label: "Projects" },
    { value: "customize" as const, label: "Customize" },
  ];

  return (
    <div className="min-h-full pb-8">
      <div className="flex items-center gap-3 px-4 pt-1">
        <button type="button" onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-full text-foreground">
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-[15px] font-semibold">Profile</h1>
      </div>

      <div className="px-4 pt-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#a78bfa] to-[#6d28d9] text-lg font-bold text-white ring-4 ring-accent/20">
          {initials}
        </div>
        <input
          value={profile.name}
          onChange={(e) => updateProfile({ name: e.target.value })}
          placeholder="Your name"
          className="serif-heading mt-3 w-full bg-transparent text-center text-xl outline-none placeholder:text-muted"
        />
        <textarea
          value={profile.bio}
          onChange={(e) => updateProfile({ bio: e.target.value })}
          placeholder="Short bio or summary..."
          rows={2}
          className="mt-2 w-full resize-none bg-transparent text-center text-sm text-muted outline-none placeholder:text-muted/60"
        />
      </div>

      <div className="mt-5 px-4">
        <SegmentedControl options={tabOptions} value={tab} onChange={setTab} />
      </div>

      <div className="mt-5 space-y-3 px-4">
        {tab === "connect" && (
          <>
            <SocialLink icon={Link2} label="LinkedIn" value={profile.linkedinUrl} onChange={(v) => updateProfile({ linkedinUrl: v })} placeholder="linkedin.com/in/you" />
            <SocialLink icon={Code} label="GitHub" value={profile.githubUrl} onChange={(v) => updateProfile({ githubUrl: v })} placeholder="github.com/you" />
            <SocialLink icon={Globe} label="Portfolio" value={profile.portfolioUrl} onChange={(v) => updateProfile({ portfolioUrl: v })} placeholder="yourportfolio.com" />
            <SocialLink icon={Globe} label="Website" value={profile.websiteUrl} onChange={(v) => updateProfile({ websiteUrl: v })} placeholder="yoursite.com" />

            <div className="card-surface p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Quick links</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "LinkedIn", url: profile.linkedinUrl },
                  { label: "GitHub", url: profile.githubUrl },
                  { label: "Portfolio", url: profile.portfolioUrl },
                  { label: "Website", url: profile.websiteUrl },
                ]
                  .filter((l) => l.url)
                  .map((l) => (
                    <a
                      key={l.label}
                      href={l.url.startsWith("http") ? l.url : `https://${l.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                {!profile.linkedinUrl && !profile.githubUrl && !profile.portfolioUrl && !profile.websiteUrl && (
                  <p className="text-xs text-muted">Add URLs above to show profile links here.</p>
                )}
              </div>
            </div>
          </>
        )}

        {tab === "projects" && (
          <>
            {profile.projectSummaries.map((p) => (
              <div key={p.id} className="card-surface p-4">
                <div className="flex items-start justify-between gap-2">
                  <input
                    value={p.title}
                    onChange={(e) => updateProject(p.id, { title: e.target.value })}
                    className="flex-1 bg-transparent text-sm font-bold outline-none"
                  />
                  <button type="button" onClick={() => removeProject(p.id)} className="text-muted">
                    <Trash2 size={14} />
                  </button>
                </div>
                <textarea
                  value={p.description}
                  onChange={(e) => updateProject(p.id, { description: e.target.value })}
                  rows={2}
                  className="mt-2 w-full resize-none bg-transparent text-[12px] text-muted outline-none"
                />
                <input
                  value={p.link ?? ""}
                  onChange={(e) => updateProject(p.id, { link: e.target.value })}
                  placeholder="Project link (optional)"
                  className="mt-2 w-full rounded-lg bg-black/5 px-2 py-1.5 text-[11px] outline-none placeholder:text-muted"
                />
              </div>
            ))}

            <div className="card-surface space-y-2 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Add project</p>
              <input
                value={newProject.title}
                onChange={(e) => setNewProject((s) => ({ ...s, title: e.target.value }))}
                placeholder="Project title"
                className="w-full rounded-lg bg-black/5 px-3 py-2 text-sm outline-none"
              />
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject((s) => ({ ...s, description: e.target.value }))}
                placeholder="What did you work on?"
                rows={2}
                className="w-full resize-none rounded-lg bg-black/5 px-3 py-2 text-sm outline-none"
              />
              <button type="button" onClick={handleAddProject} className="flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-black/15 py-2.5 text-sm text-muted">
                <Plus size={16} /> Add project
              </button>
            </div>
          </>
        )}

        {tab === "customize" && (
          <>
            <div className="card-surface p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Accent color</p>
              <div className="flex gap-2">
                {(["purple", "blue", "teal"] as AccentTheme[]).map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => updatePreferences({ accentTheme: theme })}
                    className={cn(
                      "flex-1 rounded-xl py-2.5 text-xs font-semibold capitalize",
                      profile.preferences.accentTheme === theme ? "gradient-accent text-white" : "glass-dark text-muted"
                    )}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-surface p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Default timeline filter</p>
              <SegmentedControl<TimelineFilter>
                options={[
                  { value: "all", label: "All" },
                  { value: "professional", label: "Pro" },
                  { value: "personal", label: "Personal" },
                ]}
                value={profile.preferences.defaultTimelineFilter}
                onChange={(v) => updatePreferences({ defaultTimelineFilter: v })}
              />
            </div>

            <label className="card-surface flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold">Show frequency charts</p>
                <p className="text-xs text-muted">GitHub-style activity by topic</p>
              </div>
              <input
                type="checkbox"
                checked={profile.preferences.showFrequencyOnInsights}
                onChange={(e) => updatePreferences({ showFrequencyOnInsights: e.target.checked })}
                className="h-5 w-5 accent-[#7c3aed]"
              />
            </label>

            <label className="card-surface flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold">Compact timeline</p>
                <p className="text-xs text-muted">Prioritize polished highlights</p>
              </div>
              <input
                type="checkbox"
                checked={profile.preferences.compactTimeline}
                onChange={(e) => updatePreferences({ compactTimeline: e.target.checked })}
                className="h-5 w-5 accent-[#7c3aed]"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                resetOnboarding();
                router.push("/");
              }}
              className="w-full rounded-full glass-dark py-3 text-sm font-semibold text-foreground"
            >
              Retake sign-up survey
            </button>

            <Link href="/portfolio" className="block w-full rounded-full gradient-accent py-3 text-center text-sm font-bold text-white">
              View public portfolio
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
