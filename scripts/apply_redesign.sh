#!/usr/bin/env bash
set -euo pipefail

echo "This script will overwrite three files in-place with the redesigned versions."
echo "Files: app/page.tsx, app/layout.tsx, components/BubbleShowcase.tsx"
echo "Make a backup first if you need to preserve current changes."

backup_dir="redesign-backup-$(date +%s)"
mkdir -p "$backup_dir"

for f in "app/page.tsx" "app/layout.tsx" "components/BubbleShowcase.tsx"; do
  if [ -f "$f" ]; then
    echo "Backing up $f -> $backup_dir/$(basename $f)"
    cp "$f" "$backup_dir/"
  fi
done

echo "Writing new files..."

cat > app/page.tsx <<'EOF'
"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CloudUpload,
  Sparkles,
  Target,
  WandSparkles,
} from "lucide-react";
import { useLedger } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import BubbleShowcase from "@/components/BubbleShowcase";

function Pill({ children }: { children: React.ReactNode }) {
  return <div className="rounded-full border border-white/10 bg-white/75 px-3 py-1 text-xs font-medium text-foreground shadow-[0_8px_30px_rgba(94,75,179,0.08)] backdrop-blur">{children}</div>;
}

function MockCard({
  title,
  date,
  tone,
  accent,
  labels,
  content,
}: {
  title: string;
  date: string;
  tone: "violet" | "blue" | "pink" | "green" | "amber";
  accent: string;
  labels: string[];
  content: React.ReactNode;
}) {
  const toneMap = {
    violet: "from-[#8a5cf6] to-[#5a7dff]",
    blue: "from-[#4f7cff] to-[#34c8e8]",
    pink: "from-[#ff7a8a] to-[#ff9f5a]",
    green: "from-[#34d399] to-[#22c1a4]",
    amber: "from-[#f59e0b] to-[#f97316]",
  } as const;

  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-[0_24px_50px_rgba(74,61,146,0.14)] backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">{date}</p>
          <h3 className="mt-1 text-[15px] font-semibold leading-tight">{title}</h3>
        </div>
        <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${toneMap[tone]} shadow-[0_10px_30px_rgba(95,87,197,0.25)]`} />
      </div>
      <div className="mb-4 rounded-3xl border border-border/70 bg-gradient-to-br from-[#faf7ff] to-white p-4">
        {content}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {labels.map((label) => (
          <Badge key={label}>{label}</Badge>
        ))}
      </div>
      <div className="mt-4 h-1.5 rounded-full bg-black/5">
        <div className={`h-1.5 rounded-full bg-gradient-to-r ${accent}`} />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { events } = useLedger();

  const stats = useMemo(() => {
    const sorted = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const portfolio = sorted.filter((event) => event.visibility === "portfolio").length;
    const totalSubEvents = sorted.reduce((sum, event) => sum + event.subEvents.length, 0);
    const topEvent = sorted[0];

    return {
      sorted,
      portfolio,
      totalSubEvents,
      topEvent,
      themes: [...new Set(sorted.flatMap((event) => event.skills))].slice(0, 4),
      recent: sorted.slice(0, 4),
    };
  }, [events]);

  const eventCards = [
    {
      title: stats.sorted[0]?.title ?? "Got into Boston College",
      date: stats.sorted[0]?.date ?? "May 15, 2024",
      tone: "violet" as const,
      accent: "from-[#8a5cf6] to-[#5a7dff]",
      labels: ["Portfolio", "Milestone"],
      content: (
        <div className="space-y-3">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#8a5cf6] to-[#5a7dff] text-center text-white shadow-[0_20px_50px_rgba(90,125,255,0.35)]">
            <div>
              <p className="text-[11px] opacity-80">Acceptance</p>
              <p className="text-[13px] font-semibold">Boston College</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-muted">
            {["Accepted", "Essay", "Interview", "Decision"].map((item, index) => (
              <div key={item} className="space-y-1">
                <div className={`mx-auto h-2.5 w-2.5 rounded-full ${index === 0 ? "bg-[#5a7dff]" : "bg-black/10"}`} />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: stats.sorted[1]?.title ?? "Ran First Marathon",
      date: stats.sorted[1]?.date ?? "May 4, 2025",
      tone: "blue" as const,
      accent: "from-[#4f7cff] to-[#34c8e8]",
      labels: ["Training", "Discipline"],
      content: (
        <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#4f7cff] to-[#34c8e8] text-center text-white shadow-[0_20px_50px_rgba(79,124,255,0.3)]">
          <div className="absolute -left-2 top-4 rounded-full bg-white px-2 py-1 text-[10px] font-medium text-foreground shadow">Recovery</div>
          <div className="absolute -right-3 top-2 rounded-full bg-white px-2 py-1 text-[10px] font-medium text-foreground shadow">Race Day</div>
          <div className="absolute -right-4 bottom-5 rounded-full bg-white px-2 py-1 text-[10px] font-medium text-foreground shadow">First 10</div>
          <div>
            <p className="text-[11px] opacity-80">Goal</p>
            <p className="text-[15px] font-semibold">Marathon</p>
          </div>
        </div>
      ),
    },
    {
      title: stats.sorted[2]?.title ?? "Built First Python Project",
      date: stats.sorted[2]?.date ?? "Nov 8, 2024",
      tone: "pink" as const,
      accent: "from-[#ff7a8a] to-[#ff9f5a]",
      labels: ["Technical", "Portfolio"],
      content: (
        <div className="grid grid-cols-3 gap-2">
          {["CLI", "Debug", "Ship"].map((item, index) => (
            <div key={item} className="rounded-2xl bg-white p-3 text-center shadow-sm">
              <div className={`mx-auto mb-2 h-8 w-8 rounded-full ${index === 0 ? "gradient-professional" : index === 1 ? "gradient-personal" : "gradient-portfolio"}`} />
              <p className="text-[10px] font-medium text-muted">{item}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: stats.sorted[3]?.title ?? "Internship at ABC Corp",
      date: stats.sorted[3]?.date ?? "Jun 1, 2025",
      tone: "green" as const,
      accent: "from-[#34d399] to-[#22c1a4]",
      labels: ["Leadership", "Growth"],
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-[11px] shadow-sm">
            <span>Shipped first PR</span>
            <span className="rounded-full bg-[#34d399]/15 px-2 py-0.5 text-[#0f8f6f]">Done</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-[11px] shadow-sm">
            <span>Presented demo</span>
            <span className="rounded-full bg-[#4f7cff]/15 px-2 py-0.5 text-[#335fe0]">Impact</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative overflow-hidden px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pt-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(138,92,246,0.18),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(79,124,255,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(255,159,90,0.16),_transparent_26%)]" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8a5cf6] to-[#4f7cff] text-white shadow-[0_12px_30px_rgba(95,87,197,0.3)]">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted">Proof-of-Skill Ledger</p>
              <p className="text-sm text-muted">Capture progress. Show your growth.</p>
            </div>
          </div>
          <Link href="/event/new" className="hidden rounded-full border border-border bg-white/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur transition hover:bg-white sm:inline-flex">
            Add event
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <section className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-medium text-muted shadow-sm backdrop-blur">
              <BadgeCheck size={14} className="text-[#4f7cff]" />
              Turn milestones into a living story
            </div>

            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              Your journey.
              <span className="block bg-gradient-to-r from-[#8a5cf6] via-[#5a7dff] to-[#34c8e8] bg-clip-text text-transparent">
                Every win. Forever.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
              Capture the moments that matter — school, career, personal growth, and everything in between.
              Proof-of-Skill Ledger helps you visualize progress, extract insights, and build a portfolio that feels alive.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/event/new" className="inline-flex items-center gap-2 rounded-full gradient-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(90,125,255,0.3)] transition hover:translate-y-[-1px]">
                <WandSparkles size={16} />
                Capture a win
              </Link>
              <Link href="/portfolio" className="inline-flex items-center gap-2 rounded-full border border-border bg-white/85 px-5 py-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur transition hover:bg-white">
                View portfolio
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="card-surface p-4">
                <p className="text-2xl font-semibold tracking-tight">{events.length}</p>
                <p className="mt-1 text-sm text-muted">Logged moments</p>
              </div>
              <div className="card-surface p-4">
                <p className="text-2xl font-semibold tracking-tight">{stats.portfolio}</p>
                <p className="mt-1 text-sm text-muted">Portfolio-ready wins</p>
              </div>
              <div className="card-surface p-4">
                <p className="text-2xl font-semibold tracking-tight">{stats.totalSubEvents}</p>
                <p className="mt-1 text-sm text-muted">Micro-wins captured</p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { icon: Target, title: "Capture anything", copy: "Log big milestones or tiny wins in a few taps." },
                { icon: BarChart3, title: "Visualize progress", copy: "See your growth through skill and significance patterns." },
                { icon: CloudUpload, title: "Build your story", copy: "Choose what to share publicly and keep the rest private." },
                { icon: Sparkles, title: "AI-powered summaries", copy: "Turn raw moments into polished reflections automatically." },
              ].map(({ icon: Icon, title, copy }) => (
                <div key={title} className="card-surface flex gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f2ecff] to-white text-[#5a7dff]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{copy}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {stats.themes.map((theme) => (
                <Pill key={theme}>{theme}</Pill>
              ))}
            </div>
          </section>

          <section className="relative">
            <div className="absolute -left-6 top-8 h-28 w-28 rounded-full bg-[#8a5cf6]/15 blur-3xl" />
            <div className="absolute -right-8 bottom-10 h-32 w-32 rounded-full bg-[#34c8e8]/15 blur-3xl" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-center">
                {/* Bubble cluster / phone mock */}
                {/* import at top */}
                <div className="mt-2">
                  {/* BubbleShowcase inserted here */}
                  <BubbleShowcase />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {eventCards.map((card, index) => (
                  <div key={`${card.title}-${index}`} className={index === 0 ? "" : index === 1 ? "sm:translate-y-6" : index === 2 ? "sm:-translate-y-1" : "sm:translate-y-3"}>
                    <MockCard {...card} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="card-surface p-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Recent highlights</p>
                <div className="mt-3 space-y-3">
                  {stats.recent.map((event) => (
                    <div key={event.id} className="flex items-center justify-between gap-3 rounded-2xl bg-black/[0.02] px-3 py-2.5">
                      <div>
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted">{event.skills.slice(0, 2).join(" · ")}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: event.significance }).map((_, i) => (
                          <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#5a7dff]" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-surface p-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">How it works</p>
                <div className="mt-3 space-y-3 text-sm text-muted">
                  <p>1. Log a moment with a quick title, date, and summary.</p>
                  <p>2. Split it into sub-events to show the real work behind it.</p>
                  <p>3. Decide what belongs in your public portfolio.</p>
                  <p>4. Let the AI summary turn it into a polished story.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
EOF

cat > app/layout.tsx <<'EOF'
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LedgerProvider } from "@/lib/store";
import BottomTabBar from "@/components/BottomTabBar";

export const metadata: Metadata = {
  title: "Proof-of-Skill Ledger",
  description: "Document your growth — one win at a time.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f5f5f7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LedgerProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col">
            <main className="flex-1 pb-28">{children}</main>
            <BottomTabBar />
          </div>
        </LedgerProvider>
      </body>
    </html>
  );
}
EOF

cat > components/BubbleShowcase.tsx <<'EOF'
"use client";

import { Bubble } from "@/components/Bubble";

const bubbles = [
  { x: 42, y: 16, category: "both", significance: 5, label: "BC" },
  { x: 12, y: 58, category: "personal", significance: 4, label: "Run" },
  { x: 68, y: 72, category: "professional", significance: 3, label: "Py" },
  { x: 76, y: 30, category: "both", significance: 2, label: "Offer" },
  { x: 38, y: 86, category: "personal", significance: 1, label: "20mi" },
  { x: 84, y: 86, category: "professional", significance: 2, label: "PR" },
  { x: 8, y: 8, category: "personal", significance: 2, label: "Call" },
  { x: 56, y: 52, category: "both", significance: 4, label: "Dec" },
];

export default function BubbleShowcase({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative mx-auto w-[260px] overflow-visible rounded-3xl bg-white/90 p-4 shadow-[0_30px_80px_rgba(70,50,140,0.12)] backdrop-blur-lg">
        <div className="relative mx-auto h-[520px] w-[200px] rounded-2xl bg-gradient-to-b from-white to-[#fbfbff] p-4 shadow-inner">
          {/* phone status bar */}
          <div className="mb-2 flex items-center justify-between px-2">
            <div className="h-1.5 w-14 rounded-full bg-black/5" />
            <div className="h-1.5 w-8 rounded-full bg-black/5" />
          </div>

          <div className="relative mt-2 h-[440px] w-full overflow-visible">
            {bubbles.map((b, i) => (
              <div
                key={i}
                style={{ left: `${b.x}%`, top: `${b.y}%`, transform: "translate(-50%,-50%)" }}
                className="absolute"
              >
                <Bubble category={b.category as any} significance={b.significance as any} className="flex items-center justify-center text-[11px] font-semibold">
                  {b.label}
                </Bubble>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between px-2">
            <div className="rounded-full bg-black/5 px-2 py-1 text-[11px]">Timeline</div>
            <div className="text-xs text-muted">May — 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

chmod +x scripts/apply_redesign.sh

echo "Done. Backups placed in $backup_dir. Run './scripts/apply_redesign.sh' to reapply the redesign files." 
