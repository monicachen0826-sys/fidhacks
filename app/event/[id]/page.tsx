"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus, Share2, MoreHorizontal } from "lucide-react";
import { useLedger } from "@/lib/store";
import { Bubble, getBubbleTone } from "@/components/Bubble";
import { SignificanceDots } from "@/components/SignificanceDots";
import { AiSummaryCard } from "@/components/AiSummaryCard";
import { RadialSubEvents } from "@/components/RadialSubEvents";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getEvent, setVisibility, setSignificance } = useLedger();
  const event = getEvent(id);

  if (!event) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 pt-20 text-center">
        <p className="text-sm text-muted">This event couldn&apos;t be found.</p>
        <Link href="/" className="text-sm font-medium text-accent">
          Back to timeline
        </Link>
      </div>
    );
  }

  const tone = getBubbleTone(event.category, event.id);

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="flex items-center justify-between px-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="flex items-center gap-2">
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full text-muted">
            <Share2 size={18} />
          </button>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full text-muted">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      <div className="px-4 text-center">
        <h1 className="text-xl font-bold tracking-tight">{event.title}</h1>
        <p className="mt-1 text-sm text-muted">
          {new Date(event.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
        </p>
        <div className="mt-2 flex justify-center">
          <SignificanceDots value={event.significance} onChange={(v) => setSignificance(event.id, v)} />
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-4 px-4">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sub-events">Sub-events</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="ai-story">AI Story</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {event.subEvents.length > 0 ? (
            <RadialSubEvents event={event} />
          ) : (
            <div className="flex justify-center py-6">
              <Bubble category={event.category} significance={event.significance} tone={tone}>
                <span className="text-xs font-bold">{event.skills[0]?.slice(0, 4)}</span>
              </Bubble>
            </div>
          )}

          <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-bold">About this event</h3>
            <p className="text-[14px] leading-relaxed text-foreground/90">{event.description}</p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {event.skills.map((s) => (
              <span key={s} className="rounded-full bg-accent/10 px-3 py-1 text-[12px] font-semibold text-accent">
                {s}
              </span>
            ))}
          </div>

          <Link
            href={`/event/${event.id}/sub/new`}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(99,71,217,0.4)]"
          >
            <Plus size={18} />
            Add Sub-event
          </Link>
        </TabsContent>

        <TabsContent value="sub-events" className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-muted">{event.subEvents.length} micro-wins</p>
            <Link
              href={`/event/${event.id}/sub/new`}
              className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent"
            >
              <Plus size={13} /> Add
            </Link>
          </div>

          {event.subEvents.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-sm text-muted shadow-sm">
              No micro-wins logged yet.
            </div>
          ) : (
            <div className="space-y-3">
              {event.subEvents.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/event/${event.id}/sub/${sub.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
                >
                  <Bubble
                    category={event.category}
                    significance={Math.min(sub.significance, 3) as 1 | 2 | 3}
                    tone={tone}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{sub.title}</p>
                    <p className="text-xs text-muted">
                      {new Date(sub.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <p className="mb-1 text-[10px] font-semibold text-muted">Impact</p>
                    <SignificanceDots value={sub.significance} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm font-bold">What happened?</p>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground/90">{event.description}</p>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
            <div>
              <p className="text-sm font-bold">Show in Portfolio</p>
              <p className="text-xs text-muted">Visible on your shareable portfolio</p>
            </div>
            <Switch
              checked={event.visibility === "portfolio"}
              onCheckedChange={(checked) => setVisibility(event.id, checked ? "portfolio" : "private")}
            />
          </div>
        </TabsContent>

        <TabsContent value="ai-story" className="mt-4">
          {event.aiSummary ? (
            <AiSummaryCard text={event.aiSummary} />
          ) : (
            <div className="rounded-2xl bg-white p-6 text-center text-sm text-muted shadow-sm">
              AI summary will appear here once generated.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
