"use client";

import { cn } from "@/lib/utils";
import type { Significance } from "@/lib/types";

export function SignificanceDots({
  value,
  onChange,
  size = "md",
}: {
  value: Significance;
  onChange?: (value: Significance) => void;
  size?: "sm" | "md";
}) {
  const dotSize = size === "sm" ? "h-2 w-2" : "h-3 w-3";
  return (
    <div className="flex items-center gap-1.5">
      {([1, 2, 3, 4, 5] as Significance[]).map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={cn(
            dotSize,
            "rounded-full transition-all",
            n <= value ? "gradient-accent" : "bg-black/10",
            onChange && "cursor-pointer hover:scale-110"
          )}
          aria-label={`Significance ${n}`}
        />
      ))}
    </div>
  );
}
