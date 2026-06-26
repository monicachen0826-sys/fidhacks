"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Share2, Star, ExternalLink } from "lucide-react";
import { useLedger } from "@/lib/store";
import { useProfile } from "@/lib/profile-store";
import { AppHeader } from "@/components/AppHeader";
import { SegmentedControl } from "@/components/SegmentedControl";
import { Bubble, getBubbleTone } from "@/components/Bubble";
import { AiSummaryCard } from "@/components/AiSummaryCard";

type PortfolioTab = "highlights" | "projects" | "skills" | "story";

export default function PortfolioPage() {
  const { events } = useLedger();
  const { profile } = useProfile();
  const [tab, setTab] = useState<PortfolioTab>("highlights");
  const [copied, setCopied] = useState(false);

  const portfolioEvents = useMemo(() => events.filter((e) => e.visibility === "portfolio").sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [events]);
  const storyText = portfolioEvents.map((e) => e.aiSummary ?? e.description).join(" ") || profile.bio;

  const socialLinks = [
    { label: "LinkedIn", url: profile.linkedinUrl },
    { label: "GitHub", url: profile.githubUrl },
    { label: "Portfolio", url: profile.portfolioUrl },
    { label: "Website", url: profile.websiteUrl },
  ].filter((l) => l.url);

  return (
    <div className="min-h-full pb-8">
      <AppHeader title="Portfolio" showMenu={false} profileName={profile.name} />
      <div className="px-4">
        {profile.name && <p className="serif-heading text-xl">{profile.name}</p>}
        {profile.bio && <p className="mt-1 text-sm text-muted">{profile.bio}</p>}
        {socialLinks.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {socialLinks.map((l) => (
              <a key={l.label} href={l.url.startsWith("http") ? l.url : `https://${l.url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                {l.label} <ExternalLink size={10} />
              </a>
            ))}
          </div>
        )}
        <h2 className="serif-heading mb-4 text-2xl">Portfolio</h2>
        <SegmentedControl options={[{ value: "highlights", label: "Highlights" }, { value: "projects", label: "Projects" }, { value: "skills", label: "Skills" }, { value: "story", label: "Story" }]} value={tab} onChange={setTab} />

        <div className="mt-5 space-y-3">
          {tab === "highlights" && portfolioEvents.map((e) => (
            <Link key={e.id} href={`/event/${e.id}`} className="card-surface flex items-start gap-3 p-3">
              <Bubble category={e.category} significance={Math.min(e.significance, 3) as 1 | 2 | 3} tone={getBubbleTone(e.category, e.id)} />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold">{e.title}</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: Math.min(e.significance, 3) }).map((_, i) => <Star key={i} size={10} className="fill-[#fbbf24] text-[#fbbf24]" />)}
                  </div>
                </div>
                <p className="text-[11px] text-muted">{new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
            </Link>
          ))}
          {tab === "projects" && (
            <>
              {profile.projectSummaries.map((p) => (
                <div key={p.id} className="card-surface p-3">
                  <p className="font-bold">{p.title}</p>
                  <p className="mt-1 text-[12px] text-muted">{p.description}</p>
                  {p.link && (
                    <a href={p.link.startsWith("http") ? p.link : `https://${p.link}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-accent">
                      View project ↗
                    </a>
                  )}
                </div>
              ))}
              {events.filter((e) => e.category === "professional").map((e) => (
                <Link key={e.id} href={`/event/${e.id}`} className="card-surface block p-3"><p className="font-bold">{e.title}</p><p className="mt-1 text-[11px] text-muted">{e.description.slice(0, 80)}...</p></Link>
              ))}
            </>
          )}
          {tab === "skills" && (
            <div className="flex flex-wrap gap-2">{[...new Set(events.flatMap((e) => e.skills))].map((s) => <span key={s} className="rounded-full bg-accent/15 px-3 py-1 text-[12px] text-accent">{s}</span>)}</div>
          )}
          {tab === "story" && <AiSummaryCard text={storyText || "Add portfolio-visible events and profile info to build your story."} />}
        </div>

        <button type="button" onClick={async () => { await navigator.clipboard.writeText(portfolioEvents.map((e) => e.title).join("\n")); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full gradient-accent py-3.5 text-sm font-bold text-white">
          <Share2 size={16} />{copied ? "Copied!" : "Share Portfolio"}
        </button>
      </div>
    </div>
  );
}
