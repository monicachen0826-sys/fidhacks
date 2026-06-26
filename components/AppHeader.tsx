"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppHeader({
  title = "My Ledger",
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
    <header className={cn("flex items-center justify-between px-4 pb-3 pt-4", className)}>
      {showMenu ? (
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground"
          aria-label="Menu"
        >
          <Menu size={22} strokeWidth={2} />
        </button>
      ) : (
        <div className="h-10 w-10" />
      )}
      <h1 className="text-[17px] font-bold tracking-tight">{title}</h1>
      {right ?? (
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#a78bfa] to-[#6347d9] text-xs font-semibold text-white shadow-md">
          ML
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
    <div className="flex items-center justify-between px-4 pb-4 pt-4">
      <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full text-foreground">
        <X size={22} />
      </button>
      <h1 className="text-[17px] font-bold">{title}</h1>
      <button
        type="button"
        onClick={onSave}
        disabled={!canSave}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold transition-colors",
          canSave ? "text-accent" : "text-muted"
        )}
        aria-label="Save"
      >
        ✓
      </button>
    </div>
  );
}

export function SideMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
      <button type="button" className="fixed inset-0 z-50 bg-black/30" onClick={onClose} aria-label="Close menu" />
      <nav className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <span className="text-lg font-bold">My Ledger</span>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-1 p-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-xl px-4 py-3 text-[15px] font-medium transition-colors hover:bg-black/5"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
