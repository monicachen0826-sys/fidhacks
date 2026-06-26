"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, Star } from "lucide-react";
import { useLedger } from "@/lib/store";
import { OrbitCluster } from "@/components/OrbitCluster";
import { ThemeCluster } from "@/components/ThemeCluster";
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
        {event.significance >= 4 && <Star size={20} className="mb-2 fill-amber-400 text-amber-400" />}
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
          <TabsTrigger value="microwins">Microwins ({event.subEvents.length})</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          {event.subEvents.length > 0 && <ThemeCluster category={event.category} subEvents={event.subEvents} />}

          <div className="card-surface p-4">
            <p className="text-sm font-medium">About this event</p>
            <p className="mt-1 text-[14px] leading-relaxed text-foreground/90">{event.description}</p>
          </div>

          {event.aiSummary && <AiSummaryCard text={event.aiSummary} />}

          <Link
            href={`/event/${event.id}/sub/new`}
            className="flex w-full items-center justify-center gap-1.5 rounded-full gradient-accent px-4 py-3 text-sm font-semibold text-white"
          >
            <Plus size={16} /> Add Microwin
          </Link>
        </TabsContent>

        <TabsContent value="microwins" className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-muted">{event.subEvents.length} micro-wins</p>
            <Link
              href={`/event/${event.id}/sub/new`}
              className="flex items-center gap-1 rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium"
            >
              <Plus size={13} /> Add Microwin
            </Link>
          </div>
          {event.subEvents.length === 0 ? (
            <div className="card-surface p-6 text-center text-sm text-muted">No micro-wins logged yet.</div>
          ) : (
            <>
              <OrbitCluster
                eventId={event.id}
                category={event.category}
                centerLabel={event.skills[0]?.slice(0, 2).toUpperCase() ?? event.title.slice(0, 2).toUpperCase()}
                subEvents={event.subEvents}
              />
              <Link
                href={`/event/${event.id}/subevents`}
                className="mt-2 flex items-center justify-center gap-1 text-sm font-medium text-[#4f7cff]"
              >
                View all <ChevronRight size={14} />
              </Link>
            </>
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <div className="card-surface p-4">
            <p className="text-sm font-medium">What happened</p>
            <p className="mt-1 text-[14px] leading-relaxed text-foreground/90">{event.description}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
