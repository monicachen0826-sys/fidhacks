"use client";

import { cn } from "@/lib/utils";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  pill,
}: {
  options: { value: T; label: string; selectedClassName?: string }[];
  value: T;
  onChange: (value: T) => void;
  pill?: boolean;
}) {
  if (pill) {
    return (
      <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-1.5">
        {options.map((opt, i) => {
          const selected = value === opt.value;
          const prevSelected = i > 0 && value === options[i - 1].value;
          return (
            <div key={opt.value} className="flex items-center">
              {i > 0 && !selected && !prevSelected && <span className="mx-1.5 h-3.5 w-px bg-border" />}
              <button
                type="button"
                onClick={() => onChange(opt.value)}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all",
                  selected ? opt.selectedClassName ?? "gradient-accent text-white shadow-sm" : "text-muted"
                )}
              >
                {opt.label}
              </button>
            </div>
          );
        })}
      </div>
    );
  }

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
