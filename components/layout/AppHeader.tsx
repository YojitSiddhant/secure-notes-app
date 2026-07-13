"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AuthUser } from "@/services/auth.service";
import { useLogout } from "@/hooks/useLogout";
import { CircleUserRound, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/cn";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { AppMobileProfileMenu } from "@/components/layout/AppMobileProfileMenu";
import { appNavItems } from "@/components/layout/navigation";
import { ThemeToggleSwitch } from "@/components/theme/ThemeToggleSwitch";
import {
  mobileHeaderActionButtonClassName,
  mobileHeaderShellClassName,
  mobileHeaderTitleClassName,
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

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:var(--surface-elevated)] backdrop-blur-xl supports-[backdrop-filter]:bg-[color:var(--surface-elevated)]",
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

          <div className={cn(mobileHeaderTitleClassName, "flex items-center justify-center")}>
            <BrandLogo variant="mobile" className="w-[6.5rem] sm:w-[7rem]" />
          </div>

          <ThemeToggleSwitch className="scale-[0.82] sm:scale-90" />

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

        <div className="hidden min-h-16 items-center gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:flex">
          <div className="flex min-w-0 items-center gap-3">
            <BrandLogo variant="header" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-[color:var(--foreground)] sm:text-[0.95rem]">
                Secure Notes
              </p>
              <p className="truncate text-xs text-[color:var(--muted-foreground)] sm:text-sm">
                Organized private note workspace
              </p>
            </div>
          </div>

          <nav className="mx-4 flex flex-1 items-center justify-center" aria-label="Primary">
            <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] p-1 shadow-sm">
              {appNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-slate-500/20 xl:px-4",
                      active
                        ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-md shadow-neutral-950/15"
                        : "text-[color:var(--muted-foreground)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)]"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <ThemeToggleSwitch className="scale-90 lg:scale-100" />

            <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 shadow-sm">
              {isUserLoading ? (
                <>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--primary-soft)] text-[color:var(--primary)]">
                    <span className="h-5 w-5 animate-pulse rounded-full bg-[color:var(--primary)]/20" />
                  </div>
                  <div className="hidden min-w-0 space-y-1 sm:block">
                    <div className="h-4 w-28 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                    <div className="h-3 w-24 animate-pulse rounded-full bg-[color:var(--surface-muted)]" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--primary-soft)] text-[color:var(--primary)]">
                    <CircleUserRound className="h-5 w-5" />
                  </div>
                  <div className="hidden min-w-0 sm:block">
                    <p className="truncate text-sm font-medium text-[color:var(--foreground)]">
                      {user?.name ?? "Workspace Member"}
                    </p>
                    <p className="truncate text-xs text-[color:var(--muted-foreground)]">
                      Workspace Member
                    </p>
                  </div>
                </>
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
