"use client";

import type { DayActivity } from "@/lib/types";
import { cn } from "@/lib/utils";

function level(count: number, max: number) {
  if (count === 0) return 0;
  const ratio = count / Math.max(max, 1);
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

const LEVEL_CLASS = [
  "bg-white/5",
  "bg-accent/25",
  "bg-accent/45",
  "bg-accent/65",
  "bg-accent/90",
];

export function FrequencyGrid({ days, className }: { days: DayActivity[]; className?: string }) {
  const max = Math.max(...days.map((d) => d.count), 1);
  const weeks: DayActivity[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} ${day.count === 1 ? "entry" : "entries"}`}
                className={cn("h-3 w-3 rounded-sm", LEVEL_CLASS[level(day.count, max)])}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-muted">
        <span>Less</span>
        {LEVEL_CLASS.slice(1).map((c, i) => (
          <div key={i} className={cn("h-3 w-3 rounded-sm", c)} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
