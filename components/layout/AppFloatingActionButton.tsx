"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export function AppFloatingActionButton() {
  return (
    <div className="fixed bottom-[calc(5.6rem+env(safe-area-inset-bottom))] right-4 z-30 md:hidden">
      <Link
        href="/notes?create=1"
        aria-label="Create a new note"
        className="inline-flex h-14 items-center gap-2 rounded-full border border-[color:var(--primary-border)] bg-[linear-gradient(135deg,var(--primary),#2336b5)] px-4 text-sm font-semibold text-white shadow-[0_22px_42px_-20px_rgba(56,86,240,0.7)] transition-all duration-150 ease-out hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-slate-500/20"
      >
        <Plus className="h-5 w-5" />
        New
      </Link>
    </div>
  );
}
