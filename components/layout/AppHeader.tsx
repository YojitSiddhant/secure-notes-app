"use client";

import { useRef, useState } from "react";
import type { AuthUser } from "@/services/auth.service";
import { useLogout } from "@/hooks/useLogout";
import {
  CircleUserRound,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { AppMobileProfileMenu } from "@/components/layout/AppMobileProfileMenu";
import {
  mobileHeaderActionButtonClassName,
  mobileHeaderShellClassName,
  mobileHeaderTitleClassName,
} from "@/components/ui/styles";

type AppHeaderProps = {
  onMenuClick?: () => void;
  onSidebarToggle?: () => void;
  isSidebarCollapsed?: boolean;
  isSidebarToggleVisible?: boolean;
  user?: AuthUser | null;
  isUserLoading?: boolean;
  className?: string;
};

export function AppHeader({
  onMenuClick,
  onSidebarToggle,
  isSidebarCollapsed = false,
  isSidebarToggleVisible = true,
  user,
  isUserLoading = false,
  className,
}: AppHeaderProps) {
  const logoutMutation = useLogout();
  const profileTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70",
          className
        )}
      >
        <div className={cn(mobileHeaderShellClassName, "md:hidden")}>
          <div aria-hidden="true" className="h-12 w-12 shrink-0" />

          <div className={mobileHeaderTitleClassName}>
            <p className="truncate">Secure Notes</p>
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
              <span className="h-5 w-5 animate-pulse rounded-full bg-indigo-200" />
            ) : (
              <CircleUserRound className="h-[22px] w-[22px] text-indigo-700" />
            )}
          </button>
        </div>

        <div className="hidden min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8 md:flex">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-slate-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 md:hidden"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-950/20">
                <span className="text-sm font-semibold tracking-tight">SN</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-slate-950 sm:text-[0.95rem]">
                  Secure Notes
                </p>
                <p className="truncate text-xs text-slate-500 sm:text-sm">
                  Organized private note workspace
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isSidebarToggleVisible ? (
              <button
                type="button"
                onClick={onSidebarToggle}
                className="hidden min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-slate-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 md:inline-flex"
                aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
                <span className="hidden lg:inline">
                  {isSidebarCollapsed ? "Expand" : "Collapse"}
                </span>
              </button>
            ) : null}

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              {isUserLoading ? (
                <>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <span className="h-5 w-5 animate-pulse rounded-full bg-indigo-200" />
                  </div>
                  <div className="hidden min-w-0 space-y-1 sm:block">
                    <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200/80" />
                    <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200/80" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
                    <CircleUserRound className="h-5 w-5" />
                  </div>
                  <div className="hidden min-w-0 sm:block">
                    <p className="truncate text-sm font-medium text-slate-950">
                      {user?.name ?? "Workspace Member"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
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
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-slate-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
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
