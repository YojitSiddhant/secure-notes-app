"use client";

import { useState, type ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
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
    <div className={className}>
      <AppSidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

    <div className={isSidebarCollapsed ? "md:pl-20" : "md:pl-72"}>
        <div className="flex min-h-screen flex-col bg-white">
          <AppHeader
            onMenuClick={() => setIsMobileOpen(true)}
            onSidebarToggle={() => setIsSidebarCollapsed((value) => !value)}
            isSidebarCollapsed={isSidebarCollapsed}
            isSidebarToggleVisible
            user={currentUser}
            isUserLoading={isCurrentUserLoading}
          />

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
