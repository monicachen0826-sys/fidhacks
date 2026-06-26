"use client";

import Link from "next/link";
import { Bubble, getBubbleTone } from "@/components/Bubble";
import type { Event } from "@/lib/types";

const SUB_TONES = ["blue", "green", "pink", "orange", "purple"] as const;

export function RadialSubEvents({ event }: { event: Event }) {
  const centerTone = getBubbleTone(event.category, event.id);
  const subs = event.subEvents;
  const radius = subs.length <= 2 ? 90 : subs.length <= 4 ? 105 : 115;

  return (
    <div className="relative mx-auto flex h-[280px] w-full max-w-sm items-center justify-center">
      {/* Connector lines */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {subs.map((_, i) => {
          const angle = (i / subs.length) * 2 * Math.PI - Math.PI / 2;
          const cx = 50;
          const cy = 50;
          const x = cx + (radius / 2.8) * Math.cos(angle);
          const y = cy + (radius / 2.8) * Math.sin(angle);
          return (
            <line
              key={i}
              x1={`${cx}%`}
              y1={`${cy}%`}
              x2={`${x}%`}
              y2={`${y}%`}
              stroke="#e5e5ea"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>

      {/* Center bubble */}
      <div className="relative z-10">
        <Bubble category={event.category} significance={5} tone={centerTone}>
          <div className="px-2 text-center">
            <p className="text-[10px] font-bold leading-tight">{event.title.split(" ").slice(0, 3).join(" ")}</p>
          </div>
        </Bubble>
      </div>

      {/* Orbiting sub-events */}
      {subs.map((sub, i) => {
        const angle = (i / subs.length) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const tone = SUB_TONES[i % SUB_TONES.length];

        return (
          <Link
            key={sub.id}
            href={`/event/${event.id}/sub/${sub.id}`}
            className="absolute z-10 flex flex-col items-center"
            style={{ transform: `translate(${x}px, ${y}px)` }}
          >
            <Bubble
              category={event.category}
              significance={Math.min(sub.significance, 3) as 1 | 2 | 3}
              tone={tone}
            >
              <span className="text-[9px] font-bold">{sub.title.split(" ")[0]?.slice(0, 4)}</span>
            </Bubble>
            <span className="mt-1 max-w-[72px] truncate text-[10px] font-medium text-muted">{sub.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
