"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppMobileBottomNav } from "@/components/layout/AppMobileBottomNav";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppFloatingActionButton } from "@/components/layout/AppFloatingActionButton";
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
        <div className="absolute -left-24 top-[-6rem] h-96 w-96 rounded-full bg-[color:var(--primary-soft)] blur-3xl" />
        <div className="absolute right-[-8rem] top-24 h-[26rem] w-[26rem] rounded-full bg-[color:var(--info-soft)] blur-3xl" />
        <div className="absolute bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-[color:var(--success-soft)] blur-3xl" />
      </div>

      <AppSidebar
        currentUser={currentUser}
        isCurrentUserLoading={isCurrentUserLoading}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-[19rem]">
        <AppHeader
          onMobileMenuOpen={() => setIsMobileOpen(true)}
          user={currentUser}
          isUserLoading={isCurrentUserLoading}
        />

        <main className="relative">
          <div
            key={pathname}
            className="mx-auto flex w-full max-w-[96rem] flex-col gap-4 px-3 pb-[calc(10rem+env(safe-area-inset-bottom))] pt-3 motion-safe:animate-[ui-page-switch-in_160ms_ease-out] sm:gap-6 sm:px-6 sm:pb-[calc(8rem+env(safe-area-inset-bottom))] sm:pt-6 lg:px-8 lg:pt-8"
          >
            {children}
          </div>
        </main>
      </div>

      <AppMobileBottomNav />
      <AppFloatingActionButton />
    </div>
  );
}
