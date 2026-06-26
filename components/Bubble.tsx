import { cn } from "@/lib/utils";
import type { Category, Significance } from "@/lib/types";

const SIZE_MAP: Record<Significance, number> = {
  1: 68,
  2: 84,
  3: 100,
  4: 118,
  5: 136,
};

export type BubbleTone = "purple" | "blue" | "green" | "teal" | "pink" | "orange";

const GRADIENT_MAP: Record<BubbleTone, string> = {
  purple: "gradient-bubble-purple bubble-glow-purple",
  blue: "gradient-bubble-blue bubble-glow-blue",
  green: "gradient-bubble-green bubble-glow-green",
  teal: "gradient-bubble-teal bubble-glow-teal",
  pink: "gradient-bubble-pink bubble-glow-pink",
  orange: "gradient-bubble-orange bubble-glow-orange",
};

const CATEGORY_TONE: Record<Category, BubbleTone> = {
  both: "purple",
  professional: "blue",
  personal: "teal",
};

const PERSONAL_TONES: BubbleTone[] = ["teal", "green", "orange"];

export function getBubbleTone(category: Category, eventId?: string): BubbleTone {
  if (category === "personal" && eventId) {
    const hash = eventId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return PERSONAL_TONES[hash % PERSONAL_TONES.length];
  }
  return CATEGORY_TONE[category];
}

export function Bubble({
  category,
  significance,
  children,
  className,
  tone,
  style,
}: {
  category: Category;
  significance: Significance;
  children?: React.ReactNode;
  className?: string;
  tone?: BubbleTone;
  style?: React.CSSProperties;
}) {
  const size = SIZE_MAP[significance];
  const bubbleTone = tone ?? CATEGORY_TONE[category];

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full text-white",
        GRADIENT_MAP[bubbleTone],
        className
      )}
      style={{ width: size, height: size, ...style }}
    >
      <div className="pointer-events-none absolute inset-[8%] rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent" />
      {children}
    </div>
  );
}
