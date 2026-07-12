"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, NotebookPen, UserRound } from "lucide-react";
import { cn } from "@/lib/cn";
import { Modal } from "@/components/shared/Modal";
import type { AuthUser } from "@/services/auth.service";

type AppMobileProfileMenuProps = {
  open: boolean;
  user?: AuthUser | null;
  isUserLoading?: boolean;
  onClose: () => void;
  onLogout: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

type MenuItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Notes",
    href: "/notes",
    icon: NotebookPen,
  },
];

export function AppMobileProfileMenu({
  open,
  user,
  isUserLoading = false,
  onClose,
  onLogout,
  triggerRef,
}: AppMobileProfileMenuProps) {
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isRendered, setIsRendered] = useState(open);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));

  useEffect(() => {
    if (open) {
      const frame = window.requestAnimationFrame(() => {
        setIsRendered(true);
        setLogoutConfirmOpen(false);
      });

      return () => window.cancelAnimationFrame(frame);
    }

    if (!isRendered) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsRendered(false);
    }, 240);

    return () => window.clearTimeout(timeout);
  }, [isRendered, open]);

  useEffect(() => {
    if (!isRendered) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (logoutConfirmOpen) {
          setLogoutConfirmOpen(false);
          return;
        }

        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [isRendered, logoutConfirmOpen, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setLogoutConfirmOpen(false);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (isRendered || logoutConfirmOpen) {
      return;
    }

    triggerRef.current?.focus();
  }, [isRendered, logoutConfirmOpen, triggerRef]);

  const handleClose = () => {
    setLogoutConfirmOpen(false);
    onClose();
  };

  const handleLogout = () => {
    setLogoutConfirmOpen(false);
    onClose();
    setIsLoggingOut(true);
    onLogout();
  };

  if (!isRendered) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[65] h-[100dvh] w-[100dvw] bg-slate-950/40 backdrop-blur-sm transition-opacity duration-200 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={handleClose}
      />

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-[66] flex w-[100dvw] justify-center px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-4 md:hidden",
          "transition-transform duration-300",
          open ? "translate-y-0" : "pointer-events-none translate-y-full"
        )}
        role="presentation"
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-profile-menu-title"
          className="w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/90 shadow-[0_30px_90px_-48px_rgba(15,23,42,0.42)] backdrop-blur-2xl"
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 px-4 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100">
                {isUserLoading ? (
                  <span className="h-5 w-5 animate-pulse rounded-full bg-indigo-200" />
                ) : (
                  <UserRound className="h-6 w-6" />
                )}
              </div>
              <div className="min-w-0">
                <h2
                  id="mobile-profile-menu-title"
                  className="truncate text-sm font-semibold tracking-tight text-slate-950"
                >
                  {isUserLoading ? "Loading profile" : user?.name ?? "Workspace Member"}
                </h2>
                <p className="truncate text-sm text-slate-500">
                  {isUserLoading ? "Loading email" : user?.email ?? " "}
                </p>
              </div>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:bg-slate-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              aria-label="Close profile menu"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>

          <div className="px-3 py-3">
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-2 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.18)]">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={handleClose}
                    className={cn(
                      "flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 active:scale-[0.99]",
                      active
                        ? "bg-indigo-50 text-indigo-700 shadow-[0_10px_24px_-14px_rgba(79,70,229,0.32)]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-2xl transition-colors duration-200",
                        active ? "bg-white text-indigo-600" : "bg-slate-50 text-slate-400"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200/80 px-3 py-3">
            <button
              type="button"
              onClick={() => setLogoutConfirmOpen(true)}
              className="flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-600 transition-all duration-200 hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-500/10 active:scale-[0.99]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <LogOut className="h-5 w-5" />
              </span>
              <span className="flex-1 text-left">Logout</span>
            </button>
          </div>
        </section>
      </div>

      <Modal
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        title="Sign out?"
        description="Are you sure you want to sign out of Secure Notes?"
        maxWidthClassName="max-w-md"
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setLogoutConfirmOpen(false)}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-slate-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-950/15 transition hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoggingOut ? "Logging out" : "Logout"}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-sm leading-6 text-slate-600">
            This will end your current session on this device.
          </p>
        </div>
      </Modal>
    </>
  );
}
