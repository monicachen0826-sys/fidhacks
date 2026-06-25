"use client";

import { cn } from "@/lib/utils";
import type { Significance } from "@/lib/types";

const LEVELS: Significance[] = [1, 2, 3, 4, 5];

export function ImpactSlider({
  value,
  onChange,
}: {
  value: Significance;
  onChange: (value: Significance) => void;
}) {
  return (
    <div>
      <div className="relative h-2 rounded-full bg-black/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full gradient-accent transition-all"
          style={{ width: `${((value - 1) / (LEVELS.length - 1)) * 100}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        {LEVELS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`Impact level ${n}`}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold transition-all",
              n <= value ? "gradient-accent text-white shadow-sm" : "bg-black/5 text-muted"
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
