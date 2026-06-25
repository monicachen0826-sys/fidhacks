"use client";

import { cn } from "@/lib/utils";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; selectedClassName?: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-full bg-black/5 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 rounded-full px-2.5 py-2 text-[13px] font-medium transition-all",
            value === opt.value
              ? opt.selectedClassName ?? "bg-surface text-foreground shadow-sm"
              : "text-muted"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
