"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { useLedger } from "@/lib/store";
import { Bubble } from "@/components/Bubble";
import { SignificanceDots } from "@/components/SignificanceDots";
import { AiSummaryCard } from "@/components/AiSummaryCard";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
        <Link href="/" className="text-sm font-medium text-[#4f7cff]">
          Back to timeline
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-muted"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div className="flex flex-col items-center text-center">
        <Bubble category={event.category} significance={event.significance} className="mb-4 h-28 w-28 text-base font-semibold">
          {event.skills[0]?.slice(0, 2).toUpperCase()}
        </Bubble>
        <h1 className="text-xl font-semibold tracking-tight">{event.title}</h1>
        <p className="mt-1 text-sm text-muted">
          {new Date(event.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {event.skills.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
      </div>

      <div className="card-surface mt-6 flex items-center justify-between p-4">
        <div>
          <p className="text-sm font-medium">Significance</p>
          <p className="text-xs text-muted">How big was this moment?</p>
        </div>
        <SignificanceDots value={event.significance} onChange={(v) => setSignificance(event.id, v)} />
      </div>

      <div className="card-surface mt-3 flex items-center justify-between p-4">
        <div>
          <p className="text-sm font-medium">Show in Portfolio</p>
          <p className="text-xs text-muted">Visible on your shareable portfolio</p>
        </div>
        <Switch
          checked={event.visibility === "portfolio"}
          onCheckedChange={(checked) => setVisibility(event.id, checked ? "portfolio" : "private")}
        />
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sub-events">Sub-events</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="ai-story">AI Story</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="card-surface p-4">
            <p className="text-[14px] leading-relaxed text-foreground/90">{event.description}</p>
          </div>
        </TabsContent>

        <TabsContent value="sub-events" className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-muted">{event.subEvents.length} micro-wins</p>
            <Link
              href={`/event/${event.id}/sub/new`}
              className="flex items-center gap-1 rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium"
            >
              <Plus size={13} /> Add Sub-event
            </Link>
          </div>
          {event.subEvents.length === 0 ? (
            <div className="card-surface p-6 text-center text-sm text-muted">No micro-wins logged yet.</div>
          ) : (
            <div className="flex flex-wrap justify-center gap-5 py-2">
              {event.subEvents.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/event/${event.id}/sub/${sub.id}`}
                  className="flex w-20 flex-col items-center gap-1.5 text-center"
                >
                  <Bubble category={event.category} significance={sub.significance} className="text-[10px] font-semibold">
                    {sub.skillTags[0]?.slice(0, 2).toUpperCase()}
                  </Bubble>
                  <span className="line-clamp-2 text-[11px] font-medium leading-tight">{sub.title}</span>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <div className="card-surface p-4">
            <p className="text-sm font-medium">What happened</p>
            <p className="mt-1 text-[14px] leading-relaxed text-foreground/90">{event.description}</p>
          </div>
        </TabsContent>

        <TabsContent value="ai-story" className="mt-4">
          {event.aiSummary && <AiSummaryCard text={event.aiSummary} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
