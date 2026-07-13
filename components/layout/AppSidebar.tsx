"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { appNavItems } from "@/components/layout/navigation";

type AppSidebarProps = {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  className?: string;
};

export function AppSidebar({
  isMobileOpen = false,
  onCloseMobile,
  className,
}: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity lg:hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={onCloseMobile}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(92vw,20rem)] flex-col border-r border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-[color:var(--foreground)] shadow-2xl shadow-slate-950/10 backdrop-blur-xl transition-transform duration-300 lg:hidden",
          isMobileOpen ? "pointer-events-auto translate-x-0" : "pointer-events-none -translate-x-full",
          className
        )}
        aria-label="Mobile navigation drawer"
      >
        <div className="flex min-h-16 items-center justify-between border-b border-[color:var(--border)] px-5 py-3">
          <div className="flex items-center gap-3">
            <BrandLogo variant="sidebar" />
            <div>
              <p className="text-sm font-semibold tracking-tight text-[color:var(--foreground)]">
                Secure Notes
              </p>
              <p className="text-xs text-[color:var(--muted-foreground)]">Navigation</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--border)] text-[color:var(--muted-foreground)] transition hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)] focus:outline-none focus:ring-4 focus:ring-slate-500/20"
            aria-label="Close sidebar menu"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile primary">
          <ul className="space-y-1.5">
            {appNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => onCloseMobile?.()}
                    className={cn(
                      "group relative flex h-12 w-full items-center rounded-2xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500/20",
                      "gap-3 px-3 pl-4",
                      active
                        ? "bg-[color:var(--primary-soft)] text-[color:var(--primary)] shadow-sm shadow-slate-950/5"
                        : "text-[color:var(--muted-foreground)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition",
                        active ? "text-[color:var(--primary)]" : "text-[color:var(--muted-foreground)] group-hover:text-[color:var(--foreground)]"
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
