"use client";

import { Bubble } from "@/components/Bubble";

const bubbles = [
  { x: 42, y: 16, category: "both", significance: 5, label: "BC" },
  { x: 12, y: 58, category: "personal", significance: 4, label: "Run" },
  { x: 68, y: 72, category: "professional", significance: 3, label: "Py" },
  { x: 76, y: 30, category: "both", significance: 2, label: "Offer" },
  { x: 38, y: 86, category: "personal", significance: 1, label: "20mi" },
  { x: 84, y: 86, category: "professional", significance: 2, label: "PR" },
  { x: 8, y: 8, category: "personal", significance: 2, label: "Call" },
  { x: 56, y: 52, category: "both", significance: 4, label: "Dec" },
];

export default function BubbleShowcase({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative mx-auto w-[260px] overflow-visible rounded-3xl bg-white/90 p-4 shadow-[0_30px_80px_rgba(70,50,140,0.12)] backdrop-blur-lg">
        <div className="relative mx-auto h-[520px] w-[200px] rounded-2xl bg-gradient-to-b from-white to-[#fbfbff] p-4 shadow-inner">
          {/* phone status bar */}
          <div className="mb-2 flex items-center justify-between px-2">
            <div className="h-1.5 w-14 rounded-full bg-black/5" />
            <div className="h-1.5 w-8 rounded-full bg-black/5" />
          </div>

          <div className="relative mt-2 h-[440px] w-full overflow-visible">
            {bubbles.map((b, i) => (
              <div
                key={i}
                style={{ left: `${b.x}%`, top: `${b.y}%`, transform: "translate(-50%,-50%)" }}
                className="absolute"
              >
                <Bubble category={b.category as any} significance={b.significance as any} className="flex items-center justify-center text-[11px] font-semibold">
                  {b.label}
                </Bubble>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between px-2">
            <div className="rounded-full bg-black/5 px-2 py-1 text-[11px]">Timeline</div>
            <div className="text-xs text-muted">May — 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
}
