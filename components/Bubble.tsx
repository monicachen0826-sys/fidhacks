import { cn } from "@/lib/utils";
import type { Category, Significance } from "@/lib/types";

const SIZE_MAP: Record<Significance, number> = {
  1: 44,
  2: 56,
  3: 68,
  4: 82,
  5: 96,
};

const GRADIENT_MAP: Record<Category, string> = {
  professional: "gradient-professional",
  personal: "gradient-personal",
  both: "gradient-accent",
};

export function Bubble({
  category,
  significance,
  children,
  className,
}: {
  category: Category;
  significance: Significance;
  children?: React.ReactNode;
  className?: string;
}) {
  const size = SIZE_MAP[significance];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-white shadow-lg",
        GRADIENT_MAP[category],
        className
      )}
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
}
