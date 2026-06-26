"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Target, Box, Users, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/insights", icon: LayoutGrid, label: "Insights" },
  { href: "/search", icon: Target, label: "Search" },
  { href: "/connections", icon: Users, label: "Connections" },
  { href: "/copilot", icon: Box, label: "Copilot" },
];

export default function BottomTabBar() {
  const pathname = usePathname();
  const isHiddenPage = pathname.startsWith("/event") || pathname === "/profile";
  if (isHiddenPage) return null;

  return (
    <nav className="sticky bottom-0 z-40 shrink-0">
      <div className="relative border-t border-white/10 bg-[#0a0a1a]/95 pb-safe backdrop-blur-xl">
        <div className="flex items-center justify-around px-6 py-2.5">
          {TABS.map(({ href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                  active ? "text-accent" : "text-muted"
                )}
                aria-label={href}
              >
                <Icon size={22} strokeWidth={active ? 2.25 : 1.75} />
              </Link>
            );
          })}
        </div>
      </div>

      <Link
        href="/event/new"
        className="absolute -top-5 right-5 flex h-12 w-12 items-center justify-center rounded-full gradient-accent text-white shadow-[0_8px_28px_rgba(124,58,237,0.55)] transition-transform active:scale-95"
        aria-label="Add event"
      >
        <Plus size={24} strokeWidth={2.5} />
      </Link>
    </nav>
  );
}
