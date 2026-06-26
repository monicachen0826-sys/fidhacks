"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppHeader({
  title = "My Multiverse",
  showMenu = true,
  onMenuClick,
  right,
  className,
}: {
  title?: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex items-center justify-between px-4 pb-2 pt-1", className)}>
      {showMenu ? (
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground"
          aria-label="Menu"
        >
          <Menu size={20} strokeWidth={2} />
        </button>
      ) : (
        <div className="h-9 w-9" />
      )}
      <h1 className="text-[15px] font-semibold tracking-wide text-foreground">{title}</h1>
      {right ?? (
        <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-[#a78bfa] to-[#6d28d9] ring-2 ring-white/10">
          <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-white">M</div>
        </div>
      )}
    </header>
  );
}

export function FormHeader({
  onClose,
  onSave,
  canSave,
  title,
}: {
  onClose: () => void;
  onSave: () => void;
  canSave: boolean;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 pb-3 pt-1">
      <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-foreground">
        <X size={20} />
      </button>
      <h1 className="text-[15px] font-semibold">{title}</h1>
      <button
        type="button"
        onClick={onSave}
        disabled={!canSave}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold",
          canSave ? "text-accent" : "text-muted"
        )}
        aria-label="Save"
      >
        ✓
      </button>
    </div>
  );
}

export function SideMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  const links = [
    { href: "/", label: "Timeline" },
    { href: "/insights", label: "Insights" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/search", label: "Search" },
    { href: "/copilot", label: "Copilot" },
  ];

  return (
    <>
      <button type="button" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Close menu" />
      <nav className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-white/10 bg-[#141428] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <span className="serif-heading text-lg text-foreground">My Multiverse</span>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-muted">
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-1 p-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-xl px-4 py-3 text-[14px] font-medium text-foreground/90 transition-colors hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
