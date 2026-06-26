"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Bubble } from "@/components/Bubble";
import type { Event, Significance } from "@/lib/types";

const EVENT_SIZE: Record<Significance, number> = { 1: 56, 2: 68, 3: 80, 4: 92, 5: 104 };
const SUB_SIZE = 44;
const ROW_HEIGHT = 190;
const COLUMN_FRACTIONS = [0.28, 0.68, 0.45, 0.18, 0.62, 0.35];

function hash(seed: string) {
  const sum = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (sum % 100) / 100;
}

export function EventClusterMap({ events, width = 340 }: { events: Event[]; width?: number }) {
  if (events.length === 0) {
    return (
      <div className="card-surface flex flex-col items-center gap-2 p-8 text-center">
        <p className="text-sm text-muted">Nothing here yet — log your first win.</p>
      </div>
    );
  }

  const height = events.length * ROW_HEIGHT + 60;

  const nodes = events.map((event, i) => {
    const eventSize = EVENT_SIZE[event.significance];
    const xFraction = COLUMN_FRACTIONS[i % COLUMN_FRACTIONS.length];
    const jitterX = (hash(event.id) - 0.5) * 30;
    const jitterY = (hash(event.id + "y") - 0.5) * 20;
    const x = xFraction * width + jitterX;
    const y = i * ROW_HEIGHT + ROW_HEIGHT / 2 + jitterY;

    const orbitRadius = eventSize / 2 + 38;
    const subs = event.subEvents.map((sub, j) => {
      const angle = (2 * Math.PI * j) / Math.max(event.subEvents.length, 1) - Math.PI / 2;
      const sx = x + orbitRadius * Math.cos(angle);
      const sy = y + orbitRadius * Math.sin(angle);
      return { sub, sx, sy };
    });

    return { event, x, y, eventSize, subs };
  });

  return (
    <div className="relative overflow-x-hidden" style={{ width, height }}>
      <svg className="absolute inset-0" width={width} height={height}>
        {nodes.flatMap(({ x, y, subs }) =>
          subs.map(({ sub, sx, sy }) => (
            <line key={sub.id} x1={x} y1={y} x2={sx} y2={sy} stroke="rgba(0,0,0,0.1)" strokeWidth={1.5} />
          ))
        )}
      </svg>

      {nodes.map(({ event, x, y, eventSize, subs }) => (
        <div key={event.id}>
          {subs.map(({ sub, sx, sy }) => (
            <Link
              key={sub.id}
              href={`/event/${event.id}/sub/${sub.id}`}
              className="absolute flex flex-col items-center gap-1 text-center"
              style={{ left: sx, top: sy, width: SUB_SIZE + 24, transform: "translate(-50%, -50%)" }}
            >
              <Bubble category={event.category} significance={1} className="text-[9px] font-semibold">
                {sub.title.slice(0, 2).toUpperCase()}
              </Bubble>
              <span className="line-clamp-1 text-[10px] font-medium leading-tight">{sub.title}</span>
            </Link>
          ))}

          <Link
            href={`/event/${event.id}`}
            className="absolute flex flex-col items-center gap-1 text-center"
            style={{ left: x, top: y, width: eventSize + 40, transform: "translate(-50%, -50%)" }}
          >
            <Bubble category={event.category} significance={event.significance} className="text-xs font-semibold">
              {event.title.slice(0, 2).toUpperCase()}
            </Bubble>
            <span className="line-clamp-1 text-[11px] font-semibold leading-tight">{event.title}</span>
          </Link>
        </div>
      ))}

      <Link
        href="/event/new"
        aria-label="Add new event"
        className="absolute bottom-4 right-2 flex h-12 w-12 items-center justify-center rounded-full gradient-accent text-white shadow-[0_10px_30px_rgba(80,80,255,0.4)]"
      >
        <Plus size={22} />
      </Link>
    </div>
  );
}
