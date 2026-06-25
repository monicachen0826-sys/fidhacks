"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScreenHeader({
  title,
  subtitle,
  showBack,
  right,
  className,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  return (
    <div className={cn("mb-5 flex items-center justify-between", className)}>
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-black/5"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <div>
          <h1 className="text-[19px] font-semibold tracking-tight leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}
