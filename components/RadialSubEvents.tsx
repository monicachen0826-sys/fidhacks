"use client";

import Link from "next/link";
import { Bubble, getBubbleTone, type BubbleTone } from "@/components/Bubble";
import type { Event } from "@/lib/types";

const SUB_TONES: BubbleTone[] = ["purple", "blue", "green", "teal", "orange"];

export function RadialSubEvents({ event }: { event: Event }) {
  const centerTone = getBubbleTone(event.category, event.id);
  const subs = event.subEvents;
  const radius = subs.length <= 2 ? 85 : subs.length <= 4 ? 100 : 110;

  return (
    <div className="relative mx-auto flex h-[260px] w-full items-center justify-center">
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" aria-hidden>
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
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          );
        })}
      </svg>

      <div className="relative z-10">
        <Bubble category={event.category} significance={4} tone={centerTone}>
          <div className="px-2 text-center">
            <p className="text-[9px] font-bold leading-tight opacity-90">
              {event.skills[0] ?? "Impact"}
            </p>
          </div>
        </Bubble>
      </div>

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
            <Bubble category={event.category} significance={2} tone={tone}>
              <span className="text-[8px] font-bold">{sub.skillTags[0]?.slice(0, 3) ?? i + 1}</span>
            </Bubble>
            <span className="mt-1 max-w-[64px] truncate text-[9px] text-muted">{sub.title.split(" ")[0]}</span>
          </Link>
        );
      })}
    </div>
  );
}
