"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AuthUser } from "@/services/auth.service";
import { useLogout } from "@/hooks/useLogout";
import { CircleUserRound, LogOut, Menu, UserRound } from "lucide-react";
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
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const profileLogoutButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return undefined;
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;

      if (
        profileMenuRef.current?.contains(target) ||
        profileTriggerRef.current?.contains(target)
      ) {
        return;
      }

      setIsProfileMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    const focusTimer = window.setTimeout(() => {
      profileLogoutButtonRef.current?.focus();
    }, 0);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [isProfileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:var(--surface-elevated)] backdrop-blur-xl supports-[backdrop-filter]:bg-[color:var(--surface-elevated)] motion-safe:animate-[ui-fade-in_220ms_ease-out]",
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
            <div className="inline-flex max-w-full items-center justify-center gap-8 px-2 py-1.5">
              {appNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-2 border-b-2 px-1 text-sm font-semibold transition-all duration-150 ease-out focus:outline-none focus:ring-4 focus:ring-blue-500/20 xl:px-2",
                      active
                        ? "border-[color:var(--primary)] text-[color:var(--foreground)]"
                        : "border-transparent text-[color:var(--muted-foreground)] hover:border-[color:var(--primary-border)] hover:text-[color:var(--foreground)]"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-[color:var(--primary)]" : "text-[color:var(--muted-foreground)]"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                ref={profileTriggerRef}
                type="button"
                onClick={() => setIsProfileMenuOpen((value) => !value)}
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--primary)] shadow-sm transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[color:var(--primary-border)] hover:bg-[color:var(--surface-muted)] focus:outline-none focus:ring-4 focus:ring-blue-500/20",
                  isProfileMenuOpen && "border-[color:var(--primary-border)] bg-[color:var(--surface-muted)]"
                )}
                aria-label="Open profile menu"
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
              >
                {isUserLoading ? (
                  <span className="h-5 w-5 animate-pulse rounded-full bg-[color:var(--primary-soft)]" />
                ) : (
                  <UserRound className="h-5 w-5" />
                )}
              </button>

              {isProfileMenuOpen ? (
                <div
                  ref={profileMenuRef}
                  className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[20rem] overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-2 shadow-[0_26px_70px_-34px_rgba(15,23,42,0.34)] backdrop-blur-2xl motion-safe:animate-[ui-pop-in_160ms_ease-out]"
                  role="menu"
                  aria-label="Profile menu"
                >
                  <div className="rounded-[1.15rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary-soft)] text-[color:var(--primary)] ring-1 ring-inset ring-[color:var(--primary-border)]">
                        {isUserLoading ? (
                          <span className="h-5 w-5 animate-pulse rounded-full bg-[color:var(--primary)]/20" />
                        ) : (
                          <CircleUserRound className="h-5 w-5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold tracking-tight text-[color:var(--foreground)]">
                          {isUserLoading ? "Loading profile" : user?.name ?? "Workspace Member"}
                        </p>
                        <p className="truncate text-sm text-[color:var(--muted-foreground)]">
                          {isUserLoading ? "Loading email" : user?.email ?? ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      ref={profileLogoutButtonRef}
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        if (!logoutMutation.isPending) {
                          void logoutMutation.mutateAsync();
                        }
                      }}
                      disabled={logoutMutation.isPending}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--danger)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-950/15 transition duration-150 ease-out hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-rose-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                      aria-label="Logout"
                      aria-busy={logoutMutation.isPending}
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      {logoutMutation.isPending ? "Logging out" : "Logout"}
                    </button>
                  </div>
                </div>
              ) : null}
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
