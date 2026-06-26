"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, BarChart3, Search, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const LEFT_TABS = [
  { href: "/", label: "Timeline", icon: Clock },
  { href: "/insights", label: "Insights", icon: BarChart3 },
];

const RIGHT_TABS = [
  { href: "/search", label: "Search", icon: Search },
  { href: "/copilot", label: "Copilot", icon: Sparkles },
];

function TabItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium transition-colors",
        active ? "text-accent" : "text-muted"
      )}
    >
      <Icon size={20} strokeWidth={active ? 2.25 : 2} />
      {label}
    </Link>
  );
}

export default function BottomTabBar() {
  const pathname = usePathname();
  const isEventPage = pathname.startsWith("/event");

  if (isEventPage) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40">
      <div className="relative mx-auto max-w-md border-t border-border/60 bg-white pb-safe">
        <div className="flex items-end px-2 pt-2 pb-3">
          {LEFT_TABS.map((tab) => (
            <TabItem key={tab.href} {...tab} active={pathname === tab.href} />
          ))}

          <div className="flex flex-1 flex-col items-center">
            <Link
              href="/event/new"
              className="relative -top-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_28px_rgba(99,71,217,0.5)] transition-transform active:scale-95"
            >
              <Plus size={28} strokeWidth={2.5} />
            </Link>
          </div>

          {RIGHT_TABS.map((tab) => (
            <TabItem key={tab.href} {...tab} active={pathname === tab.href} />
          ))}
        </div>
      </div>
    </nav>
  );
}
