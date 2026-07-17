"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, NotebookPen } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  mobileBottomNavIconClassName,
  mobileBottomNavIndicatorClassName,
  mobileBottomNavItemActiveClassName,
  mobileBottomNavItemClassName,
  mobileBottomNavItemInactiveClassName,
  mobileBottomNavShellClassName,
} from "@/components/ui/styles";

type MobileNavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

const mobileNavItems: MobileNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Notes", href: "/notes", icon: NotebookPen },
];

export function AppMobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 md:hidden landscape:hidden motion-safe:animate-[ui-rise-in_300ms_ease-out]">
      <div className="mx-auto w-full max-w-[24rem] px-2 pb-0 pt-2">
        <nav aria-label="Primary mobile" className={mobileBottomNavShellClassName}>
          <div className="grid grid-cols-2 gap-2">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    mobileBottomNavItemClassName,
                    active ? mobileBottomNavItemActiveClassName : mobileBottomNavItemInactiveClassName
                  )}
                >
                  <span
                    className={cn(
                      mobileBottomNavIndicatorClassName,
                      active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                    )}
                  />
                  <Icon
                    className={cn(
                      mobileBottomNavIconClassName,
                      active
                        ? "h-6 w-6 scale-110 text-[color:var(--primary)]"
                        : "h-[22px] w-[22px] text-[color:var(--muted-foreground)] group-hover:text-[color:var(--foreground)]"
                    )}
                  />
                  <span className="text-[0.9rem] font-medium tracking-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
