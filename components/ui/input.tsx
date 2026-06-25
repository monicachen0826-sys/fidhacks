import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-[15px] outline-none transition-colors focus:border-[#4f7cff]",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[88px] w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[15px] outline-none transition-colors focus:border-[#4f7cff]",
        className
      )}
      {...props}
    />
  );
}
