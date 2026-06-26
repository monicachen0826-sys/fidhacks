import { cn } from "@/lib/utils";
import type { Category, Significance } from "@/lib/types";

const SIZE_MAP: Record<Significance, number> = {
  1: 72,
  2: 88,
  3: 104,
  4: 120,
  5: 136,
};

type BubbleTone = "purple" | "blue" | "green" | "pink" | "orange";

const GRADIENT_MAP: Record<BubbleTone, string> = {
  purple: "gradient-bubble-purple bubble-glow-purple",
  blue: "gradient-bubble-blue bubble-glow-blue",
  green: "gradient-bubble-green bubble-glow-green",
  pink: "gradient-bubble-pink bubble-glow-pink",
  orange: "gradient-bubble-orange bubble-glow-orange",
};

const CATEGORY_TONE: Record<Category, BubbleTone> = {
  both: "purple",
  professional: "blue",
  personal: "pink",
};

const PERSONAL_TONES: BubbleTone[] = ["pink", "green", "orange"];

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
}: {
  category: Category;
  significance: Significance;
  children?: React.ReactNode;
  className?: string;
  tone?: BubbleTone;
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
      style={{ width: size, height: size }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent" />
      {children}
    </div>
  );
}
