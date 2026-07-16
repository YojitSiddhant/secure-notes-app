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
    <div className={cn("relative min-h-screen overflow-x-clip", className)}>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 right-[-6rem] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-[-8rem] top-1/3 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-1/4 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      </div>

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
            className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col gap-4 px-3 py-3 pb-[calc(9rem+env(safe-area-inset-bottom))] motion-safe:max-md:animate-[ui-mobile-route-in_240ms_ease-out] sm:gap-6 sm:px-6 sm:py-6 md:pb-8 lg:px-8 lg:py-8"
          >
            {children}
          </div>
        </main>
      </div>

      <AppMobileBottomNav />
    </div>
  );
}
