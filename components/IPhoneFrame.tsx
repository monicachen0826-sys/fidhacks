import { Signal, Wifi, BatteryFull } from "lucide-react";

export function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d8d8dd] p-6">
      <div
        className="relative h-[844px] w-[390px] rounded-[62px] bg-gradient-to-b from-[#3a3a3c] to-[#1c1c1e] p-[3px] shadow-2xl"
        style={{ transform: "translateZ(0)" }}
      >
        {/* side buttons */}
        <div className="absolute -left-[3px] top-[110px] h-7 w-[3px] rounded-l-sm bg-[#2c2c2e]" />
        <div className="absolute -left-[3px] top-[155px] h-12 w-[3px] rounded-l-sm bg-[#2c2c2e]" />
        <div className="absolute -left-[3px] top-[215px] h-12 w-[3px] rounded-l-sm bg-[#2c2c2e]" />
        <div className="absolute -right-[3px] top-[170px] h-16 w-[3px] rounded-r-sm bg-[#2c2c2e]" />

        <div className="relative h-full w-full overflow-hidden rounded-[59px] border border-black/40 bg-black">
          <div className="absolute inset-0 overflow-hidden rounded-[59px] bg-background">
            <div className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-9 pt-3.5 text-[13px] font-semibold text-foreground">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Signal size={14} />
                <Wifi size={14} />
                <BatteryFull size={16} />
              </div>
            </div>
            <div className="absolute left-1/2 top-2.5 z-50 h-[34px] w-[110px] -translate-x-1/2 rounded-full bg-black" />

            <div className="h-full w-full overflow-y-auto pt-11">{children}</div>

            <div className="absolute inset-x-0 bottom-1.5 z-50 flex justify-center">
              <div className="h-[5px] w-[134px] rounded-full bg-foreground/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
