"use client";

import Link from "next/link";
import { Bubble } from "@/components/Bubble";
import type { Category, SubEvent } from "@/lib/types";

export function OrbitCluster({
  eventId,
  category,
  centerLabel,
  subEvents,
  size = 280,
}: {
  eventId: string;
  category: Category;
  centerLabel: string;
  subEvents: SubEvent[];
  size?: number;
}) {
  const radius = size * 0.34;
  const center = size / 2;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <div
        className="absolute flex items-center justify-center"
        style={{ left: center, top: center, transform: "translate(-50%, -50%)" }}
      >
        <Bubble category={category} significance={5} className="h-24 w-24 text-sm font-semibold text-center px-2">
          {centerLabel}
        </Bubble>
      </div>
      {subEvents.map((sub, i) => {
        const angle = (2 * Math.PI * i) / subEvents.length - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return (
          <Link
            key={sub.id}
            href={`/event/${eventId}/sub/${sub.id}`}
            className="absolute flex w-20 flex-col items-center gap-1 text-center"
            style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
          >
            <Bubble category={category} significance={sub.significance} className="text-[10px] font-semibold">
              {sub.skillTags[0]?.slice(0, 2).toUpperCase() ?? sub.title.slice(0, 2).toUpperCase()}
            </Bubble>
            <span className="line-clamp-2 text-[11px] font-medium leading-tight">{sub.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
