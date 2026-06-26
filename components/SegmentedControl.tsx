"use client";

import { cn } from "@/lib/utils";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  variant = "pill",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  variant?: "pill" | "underline";
}) {
  if (variant === "underline") {
    return (
      <div className="flex gap-4 border-b border-black/10">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "pb-2.5 text-[13px] font-semibold transition-colors",
              value === opt.value
                ? "border-b-2 border-accent text-foreground"
                : "text-muted"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 rounded-full glass-dark p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 rounded-full px-3 py-2 text-[13px] font-semibold transition-all",
            value === opt.value
              ? "gradient-accent text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]"
              : "text-muted hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
