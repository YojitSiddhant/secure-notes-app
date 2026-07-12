"use client";

import { useState, type ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { cn } from "@/lib/cn";
import type { AuthUser } from "@/services/auth.service";

type AppLayoutProps = {
  children: ReactNode;
  currentUser?: AuthUser | null;
  isCurrentUserLoading?: boolean;
  className?: string;
};

export function AppLayout({
  children,
  currentUser,
  isCurrentUserLoading = false,
  className,
}: AppLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={cn("relative min-h-screen overflow-x-clip", className)}>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 right-[-6rem] h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute left-[-8rem] top-1/3 h-80 w-80 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-1/4 h-80 w-80 rounded-full bg-sky-200/20 blur-3xl" />
      </div>

      <AppSidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className={isSidebarCollapsed ? "md:pl-20" : "md:pl-72"}>
        <div className="flex min-h-screen flex-col bg-transparent">
          <AppHeader
            onMenuClick={() => setIsMobileOpen(true)}
            onSidebarToggle={() => setIsSidebarCollapsed((value) => !value)}
            isSidebarCollapsed={isSidebarCollapsed}
            isSidebarToggleVisible
            user={currentUser}
            isUserLoading={isCurrentUserLoading}
          />

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-[92rem] flex-1 flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
