"use client";

import { Bubble } from "@/components/Bubble";
import type { Category, Significance, SubEvent } from "@/lib/types";

function groupThemes(subEvents: SubEvent[]) {
  const counts = new Map<string, number>();
  for (const sub of subEvents) {
    const theme = sub.skillTags[0] ?? "General";
    counts.set(theme, (counts.get(theme) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function sizeForCount(count: number, max: number): Significance {
  const ratio = count / max;
  if (ratio >= 0.8) return 5;
  if (ratio >= 0.6) return 4;
  if (ratio >= 0.4) return 3;
  if (ratio >= 0.2) return 2;
  return 1;
}

export function ThemeCluster({ category, subEvents, size = 280 }: { category: Category; subEvents: SubEvent[]; size?: number }) {
  const themes = groupThemes(subEvents);
  if (themes.length === 0) return null;

  const maxCount = themes[0][1];
  const center = size / 2;
  const radius = size * 0.3;
  const [centerTheme, ...orbitThemes] = themes;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <div
        className="absolute flex flex-col items-center justify-center text-center"
        style={{ left: center, top: center, transform: "translate(-50%, -50%)" }}
      >
        <Bubble category={category} significance={5} className="h-24 w-24 flex-col gap-0.5 px-2 text-[11px] font-semibold">
          <span className="line-clamp-2 leading-tight">{centerTheme[0]}</span>
          <span className="text-[13px] font-bold">{centerTheme[1]}</span>
        </Bubble>
      </div>
      {orbitThemes.map(([theme, count], i) => {
        const angle = (2 * Math.PI * i) / orbitThemes.length - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return (
          <div
            key={theme}
            className="absolute flex w-20 flex-col items-center text-center"
            style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
          >
            <Bubble category={category} significance={sizeForCount(count, maxCount)} className="flex-col gap-0.5 px-2 text-[10px] font-semibold">
              <span className="line-clamp-2 leading-tight">{theme}</span>
              <span className="text-[12px] font-bold">{count}</span>
            </Bubble>
          </div>
        );
      })}
    </div>
  );
}
