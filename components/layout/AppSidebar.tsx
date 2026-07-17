"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronRight, NotebookPen, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { appNavItems } from "@/components/layout/navigation";
import { secondaryButtonClassName } from "@/components/ui/styles";
import type { AuthUser } from "@/services/auth.service";

type AppSidebarProps = {
  currentUser?: AuthUser | null;
  isCurrentUserLoading?: boolean;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  className?: string;
};

export function AppSidebar({
  currentUser,
  isCurrentUserLoading = false,
  isMobileOpen = false,
  onCloseMobile,
  className,
}: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden w-[19rem] flex-col border-r border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,250,255,0.88))] px-4 py-4 shadow-[0_30px_80px_-52px_rgba(15,23,42,0.32)] backdrop-blur-2xl lg:flex",
          className
        )}
        aria-label="Primary navigation"
      >
        <div className="flex h-full flex-col rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.28)]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo variant="sidebar" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-[color:var(--foreground)]">
                  Secure Notes
                </p>
                <p className="truncate text-xs text-[color:var(--muted-foreground)]">
                  Calm, private workspace
                </p>
              </div>
            </div>

            <Link
              href="/notes?create=1"
              className={cn(
                secondaryButtonClassName,
                "w-full justify-between border-[color:var(--primary-border)] bg-[linear-gradient(135deg,rgba(56,86,240,0.1),rgba(255,255,255,0.96))] text-[color:var(--foreground)] hover:text-[color:var(--primary)]"
              )}
            >
              <span className="inline-flex items-center gap-2">
                <NotebookPen className="h-4 w-4 text-[color:var(--primary)]" />
                New Note
              </span>
              <ArrowRight className="h-4 w-4 text-[color:var(--primary)]" />
            </Link>
          </div>

          <nav className="mt-6 flex-1 space-y-2" aria-label="Main">
            {appNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-[1.25rem] border px-3 py-3 text-sm font-medium transition-all duration-150 ease-out",
                    active
                      ? "border-[color:var(--primary-border)] bg-[color:var(--primary-soft)] text-[color:var(--primary)] shadow-[0_14px_30px_-22px_rgba(56,86,240,0.45)]"
                      : "border-transparent bg-transparent text-[color:var(--muted-foreground)] hover:border-[color:var(--border)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)]"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-2xl transition",
                        active ? "bg-white/70 text-[color:var(--primary)]" : "bg-[color:var(--surface)]"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>{item.label}</span>
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition",
                      active ? "text-[color:var(--primary)]" : "text-[color:var(--muted-foreground)]"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 space-y-4">
            <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,255,0.92))] p-4 shadow-[0_18px_42px_-32px_rgba(15,23,42,0.22)]">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--primary-soft)] text-[color:var(--primary)]">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold tracking-tight text-[color:var(--foreground)]">
                    Workspace ready
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
                    Capture notes, review priorities, and move from idea to action in one calm flow.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4 shadow-[0_18px_42px_-32px_rgba(15,23,42,0.22)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Signed in
              </p>
              <p className="mt-2 truncate text-sm font-semibold text-[color:var(--foreground)]">
                {isCurrentUserLoading ? "Loading profile..." : currentUser?.name ?? "Workspace member"}
              </p>
              <p className="truncate text-sm text-[color:var(--muted-foreground)]">
                {isCurrentUserLoading ? "Loading email..." : currentUser?.email ?? "Private account"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-150 ease-out lg:hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={onCloseMobile}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(92vw,20rem)] flex-col border-r border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,255,0.94))] text-[color:var(--foreground)] shadow-2xl shadow-slate-950/10 backdrop-blur-2xl transition-transform duration-180 ease-out lg:hidden",
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
          <div className="space-y-2">
            {appNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => onCloseMobile?.()}
                  className={cn(
                    "group flex h-14 w-full items-center justify-between rounded-[1.25rem] border px-4 text-sm font-medium transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-slate-500/20",
                    active
                      ? "border-[color:var(--primary-border)] bg-[color:var(--primary-soft)] text-[color:var(--primary)] shadow-[0_14px_28px_-20px_rgba(56,86,240,0.45)]"
                      : "border-transparent text-[color:var(--muted-foreground)] hover:border-[color:var(--border)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)]"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-2xl transition",
                        active ? "bg-white/70 text-[color:var(--primary)]" : "bg-[color:var(--surface)]"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>{item.label}</span>
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4",
                      active ? "text-[color:var(--primary)]" : "text-[color:var(--muted-foreground)]"
                    )}
                  />
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
