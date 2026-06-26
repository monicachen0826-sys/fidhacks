"use client";

import { Signal, Wifi, BatteryMedium } from "lucide-react";

export function StatusBar() {
  return (
    <div className="relative z-50 flex h-12 shrink-0 items-end justify-between px-7 pb-1.5 pt-2 text-[11px] font-semibold text-foreground">
      <span>9:41</span>
      <div className="flex items-center gap-1 text-foreground/90">
        <Signal size={14} strokeWidth={2.5} />
        <Wifi size={14} strokeWidth={2.5} />
        <BatteryMedium size={16} strokeWidth={2.5} />
      </div>
    </div>
  );
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-shell">
      <div className="phone-bezel">
        <div className="phone-island" aria-hidden />
        <div className="phone-screen stars-bg">
          <StatusBar />
          <div className="phone-screen-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}
