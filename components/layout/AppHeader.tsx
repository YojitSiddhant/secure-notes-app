"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, LogOut, Menu, NotebookPen } from "lucide-react";
import type { AuthUser } from "@/services/auth.service";
import { useLogout } from "@/hooks/useLogout";
import { cn } from "@/lib/cn";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { AppMobileProfileMenu } from "@/components/layout/AppMobileProfileMenu";
import { appNavItems } from "@/components/layout/navigation";
import {
  mobileHeaderActionButtonClassName,
  mobileHeaderShellClassName,
} from "@/components/ui/styles";

type AppHeaderProps = {
  onMobileMenuOpen?: () => void;
  user?: AuthUser | null;
  isUserLoading?: boolean;
  className?: string;
};

export function AppHeader({
  onMobileMenuOpen,
  user,
  isUserLoading = false,
  className,
}: AppHeaderProps) {
  const logoutMutation = useLogout();
  const profileTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();

  const activeItem =
    appNavItems.find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"))
    ) ?? appNavItems[0];
  const currentTitle = activeItem?.label ?? "Workspace";
  const currentSubtitle = pathname.startsWith("/notes")
    ? "Capture, refine, and prioritize your notes."
    : "Overview of your secure workspace.";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 border-b border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,250,255,0.82))] backdrop-blur-2xl supports-[backdrop-filter]:bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,250,255,0.82))]",
          className
        )}
      >
        <div className={cn(mobileHeaderShellClassName, "lg:hidden")}>
          <button
            type="button"
            onClick={onMobileMenuOpen}
            className={mobileHeaderActionButtonClassName}
            aria-label="Open navigation menu"
          >
            <Menu className="h-[22px] w-[22px] text-[color:var(--primary)]" />
          </button>

          <div className="flex min-w-0 flex-1 flex-col items-center px-2 text-center">
            <p className="truncate text-[0.98rem] font-semibold tracking-tight text-[color:var(--foreground)]">
              {currentTitle}
            </p>
            <p className="truncate text-[0.75rem] text-[color:var(--muted-foreground)]">
              {currentSubtitle}
            </p>
          </div>

          <button
            ref={profileTriggerRef}
            type="button"
            onClick={() => setIsProfileMenuOpen((value) => !value)}
            className={mobileHeaderActionButtonClassName}
            aria-label="Open profile menu"
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="dialog"
          >
            {isUserLoading ? (
              <span className="h-5 w-5 animate-pulse rounded-full bg-[color:var(--primary-soft)]" />
            ) : (
              <CircleUserRound className="h-[22px] w-[22px] text-[color:var(--primary)]" />
            )}
          </button>
        </div>

        <div className="hidden min-h-20 items-center gap-4 px-4 py-4 lg:flex lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <BrandLogo variant="header" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold tracking-tight text-[color:var(--foreground)] sm:text-[0.98rem]">
                  {currentTitle}
                </p>
                <span className="hidden rounded-full border border-[color:var(--primary-border)] bg-[color:var(--primary-soft)] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--primary)] xl:inline-flex">
                  {pathname.startsWith("/notes") ? "Capture" : "Overview"}
                </span>
              </div>
              <p className="truncate text-sm text-[color:var(--muted-foreground)]">
                {currentSubtitle}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/notes?create=1"
              className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[color:var(--primary-border)] bg-[linear-gradient(135deg,rgba(56,86,240,0.1),rgba(255,255,255,0.94))] px-4 text-sm font-semibold text-[color:var(--foreground)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:text-[color:var(--primary)] focus:outline-none focus:ring-4 focus:ring-slate-500/20"
            >
              <NotebookPen className="h-4 w-4 text-[color:var(--primary)]" />
              New Note
            </Link>

            <div className="flex items-center gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-3 py-2 shadow-sm">
              {isUserLoading ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--primary-soft)] text-[color:var(--primary)]">
                    <span className="h-5 w-5 animate-pulse rounded-full bg-[color:var(--primary)]/20" />
                  </div>
                  <div className="hidden min-w-0 space-y-1 sm:block">
                    <div className="h-4 w-28 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                    <div className="h-3 w-24 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--primary-soft)] text-[color:var(--primary)]">
                    <CircleUserRound className="h-5 w-5" />
                  </div>
                  <div className="hidden min-w-0 sm:block">
                    <p className="truncate text-sm font-medium text-[color:var(--foreground)]">
                      {user?.name ?? "Workspace Member"}
                    </p>
                    <p className="truncate text-xs text-[color:var(--muted-foreground)]">
                      {user?.email ?? "Private account"}
                    </p>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  if (!logoutMutation.isPending) {
                    void logoutMutation.mutateAsync();
                  }
                }}
                disabled={logoutMutation.isPending}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--primary-border)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--primary)] focus:outline-none focus:ring-4 focus:ring-slate-500/20"
                aria-label="Logout"
                aria-busy={logoutMutation.isPending}
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  {logoutMutation.isPending ? "Logging out" : "Logout"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <AppMobileProfileMenu
        open={isProfileMenuOpen}
        triggerRef={profileTriggerRef}
        user={user}
        isUserLoading={isUserLoading}
        onClose={() => setIsProfileMenuOpen(false)}
        onLogout={() => {
          if (!logoutMutation.isPending) {
            void logoutMutation.mutateAsync();
          }
        }}
      />
    </>
  );
}
