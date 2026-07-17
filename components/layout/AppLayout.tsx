"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppMobileBottomNav } from "@/components/layout/AppMobileBottomNav";
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
  const pathname = usePathname();

  return (
    <div className={cn("relative min-h-screen overflow-x-clip bg-white", className)}>

      <AppSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="flex min-h-screen flex-col bg-transparent">
        <AppHeader
          onMobileMenuOpen={() => setIsMobileOpen(true)}
          user={currentUser}
          isUserLoading={isCurrentUserLoading}
        />

        <main className="flex-1 overflow-y-auto">
          <div
            key={pathname}
            className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col gap-4 px-3 py-3 pb-[calc(9rem+env(safe-area-inset-bottom))] motion-safe:animate-[ui-page-switch-in_160ms_ease-out] sm:gap-6 sm:px-6 sm:py-6 landscape:pb-6 md:pb-8 lg:px-8 lg:py-8"
          >
            {children}
          </div>
        </main>
      </div>

      <AppMobileBottomNav />
    </div>
  );
}
