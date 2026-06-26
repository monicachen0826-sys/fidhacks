import { Signal, Wifi, BatteryFull } from "lucide-react";

export function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e5e5ea] p-6">
      <div
        className="relative h-[844px] w-[390px] overflow-hidden rounded-[55px] border-[6px] border-black bg-black shadow-2xl"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[49px] bg-background">
          <div className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-9 pt-3.5 text-[13px] font-semibold text-foreground">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <Signal size={14} />
              <Wifi size={14} />
              <BatteryFull size={16} />
            </div>
          </div>
          <div className="absolute left-1/2 top-2.5 z-50 h-7 w-[120px] -translate-x-1/2 rounded-full bg-black" />

          <div className="h-full w-full overflow-y-auto pt-11">{children}</div>

          <div className="absolute inset-x-0 bottom-2 z-50 flex justify-center">
            <div className="h-1 w-32 rounded-full bg-black/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
