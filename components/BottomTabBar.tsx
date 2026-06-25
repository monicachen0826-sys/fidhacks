"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/copilot", label: "Copilot", icon: Sparkles },
  { href: "/portfolio", label: "Portfolio", icon: BookOpen },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center pb-5 px-4">
      <div className="mx-auto flex w-full max-w-sm items-center justify-between rounded-full border border-border bg-surface/90 px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-[11px] font-medium transition-colors",
                active ? "text-foreground" : "text-muted"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                  active && "gradient-accent text-white shadow-sm"
                )}
              >
                <Icon size={16} strokeWidth={2.25} />
              </div>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
