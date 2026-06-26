"use client";

import { cn } from "@/lib/utils";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-full border border-border/80 bg-white shadow-sm">
      {options.map((opt, index) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 px-3 py-2.5 text-[13px] font-semibold transition-all",
            index > 0 && "border-l border-border/60",
            value === opt.value
              ? "bg-accent text-white"
              : "text-foreground/70 hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
