"use client";

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

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-slate-200 bg-white",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-slate-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 md:hidden"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-950/20">
              <span className="text-sm font-semibold tracking-tight">SN</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-slate-950">
                Secure Notes
              </p>
              <p className="truncate text-xs text-slate-500">
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
              className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-slate-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 md:inline-flex"
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
              className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-slate-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
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
  );
}
