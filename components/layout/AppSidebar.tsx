"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, NotebookPen } from "lucide-react";
import { cn } from "@/lib/cn";

type SidebarItem = {
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
};

type AppSidebarProps = {
  isCollapsed?: boolean;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  className?: string;
};

export function AppSidebar({
  isCollapsed = false,
  isMobileOpen = false,
  onCloseMobile,
  className,
}: AppSidebarProps) {
  const pathname = usePathname();

  const navItemsWithHref: SidebarItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Notes", icon: NotebookPen, href: "/notes" },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-white/70 bg-white/85 text-slate-700 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)] backdrop-blur-xl transition-[width] duration-300 md:flex",
          isCollapsed ? "w-20" : "w-72",
          className
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-950/15">
            <span className="text-sm font-bold tracking-tight">SN</span>
          </div>
          {!isCollapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-slate-900">
                Secure Notes
              </p>
              <p className="truncate text-xs text-slate-500">
                Private note operations
              </p>
            </div>
          ) : null}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Primary">
          <p
            className={cn(
              "px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500",
              isCollapsed && "sr-only"
            )}
          >
            Menu
          </p>
          <ul className="mt-4 space-y-1.5">
            {navItemsWithHref.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => onCloseMobile?.()}
                    className={cn(
                      "group relative flex h-12 w-full items-center rounded-2xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10",
                      isCollapsed ? "justify-center px-0" : "gap-3 px-3 pl-4",
                      active
                        ? "bg-[#EEF4FF] text-indigo-700 shadow-sm shadow-slate-950/5"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition",
                        active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                      )}
                    />
                    {!isCollapsed ? <span>{item.label}</span> : <span className="sr-only">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity md:hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={onCloseMobile}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(92vw,20rem)] flex-col border-r border-white/70 bg-white/95 text-slate-700 shadow-2xl shadow-slate-950/10 backdrop-blur-xl transition-transform duration-300 md:hidden",
          isMobileOpen ? "pointer-events-auto translate-x-0" : "pointer-events-none -translate-x-full"
        )}
        aria-label="Mobile navigation drawer"
      >
        <div className="flex min-h-16 items-center justify-between border-b border-slate-200/80 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-950/15">
              <span className="text-sm font-bold tracking-tight">SN</span>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900">
                Secure Notes
              </p>
              <p className="text-xs text-slate-500">Navigation</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            aria-label="Close sidebar menu"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile primary">
          <ul className="space-y-1.5">
            {navItemsWithHref.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => onCloseMobile?.()}
                    className={cn(
                      "group relative flex h-12 w-full items-center gap-3 rounded-2xl px-3 pl-4 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10",
                      active
                        ? "bg-[#EEF4FF] text-indigo-700 shadow-sm shadow-slate-950/5"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition",
                        active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
