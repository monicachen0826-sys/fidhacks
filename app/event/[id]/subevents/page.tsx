"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, CheckCircle2, GraduationCap, MapPin, Plus, Users, Wallet } from "lucide-react";
import { useLedger } from "@/lib/store";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SignificanceDots } from "@/components/SignificanceDots";

const SUB_ICONS = [CheckCircle2, Calendar, Users, GraduationCap, Wallet, MapPin];
const BUBBLE_GRADIENTS = [
  "gradient-bubble-1",
  "gradient-bubble-2",
  "gradient-bubble-3",
  "gradient-bubble-4",
  "gradient-bubble-5",
  "gradient-bubble-6",
];

export default function SubEventsListPage() {
  const { id } = useParams<{ id: string }>();
  const { getEvent } = useLedger();
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
      <ScreenHeader
        title={event.title}
        subtitle="Micro-wins"
        showBack
        right={
          <Link
            href={`/event/${event.id}/sub/new`}
            aria-label="Add micro-win"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-foreground"
          >
            <Plus size={16} />
          </Link>
        }
      />

      {event.subEvents.length === 0 ? (
        <div className="card-surface p-6 text-center text-sm text-muted">No micro-wins logged yet.</div>
      ) : (
        <div className="space-y-2.5">
          {event.subEvents.map((sub, i) => {
            const Icon = SUB_ICONS[i % SUB_ICONS.length];
            return (
            <Link key={sub.id} href={`/event/${event.id}/sub/${sub.id}`} className="card-surface flex items-center gap-3 p-3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ${BUBBLE_GRADIENTS[i % BUBBLE_GRADIENTS.length]}`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium leading-tight">{sub.title}</p>
                <p className="truncate text-xs text-muted">
                  {new Date(sub.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Impact</p>
                <SignificanceDots value={sub.significance} />
              </div>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
