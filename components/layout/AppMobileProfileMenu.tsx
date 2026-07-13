"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { LogOut, UserRound } from "lucide-react";
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

export function AppMobileProfileMenu({
  open,
  user,
  isUserLoading = false,
  onClose,
  onLogout,
  triggerRef,
}: AppMobileProfileMenuProps) {
  const logoutButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isRendered, setIsRendered] = useState(open);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

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
      logoutButtonRef.current?.focus();
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
          "fixed inset-0 z-[66] flex items-center justify-center px-3 py-3 md:hidden",
          "transition-transform duration-300",
          open ? "translate-y-0" : "pointer-events-none translate-y-full"
        )}
        role="presentation"
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-profile-menu-title"
          className="flex w-full max-w-md max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] shadow-[0_30px_90px_-48px_rgba(15,23,42,0.42)] backdrop-blur-2xl"
        >
          <div className="border-b border-[color:var(--border)] px-4 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary-soft)] text-[color:var(--primary)] ring-1 ring-inset ring-[color:var(--primary-border)]">
                {isUserLoading ? (
                  <span className="h-5 w-5 animate-pulse rounded-full bg-[color:var(--primary-soft)]" />
                ) : (
                  <UserRound className="h-6 w-6" />
                )}
              </div>
              <div className="min-w-0">
                <h2
                  id="mobile-profile-menu-title"
                  className="truncate text-sm font-semibold tracking-tight text-[color:var(--foreground)]"
                >
                  {isUserLoading ? "Loading profile" : user?.name ?? "Workspace Member"}
                </h2>
                <p className="truncate text-sm text-[color:var(--muted-foreground)]">
                  {isUserLoading ? "Loading email" : user?.email ?? " "}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[color:var(--border)] px-4 py-4">
            <button
              ref={logoutButtonRef}
              type="button"
              onClick={() => setLogoutConfirmOpen(true)}
              className="flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[color:var(--danger)] transition-all duration-200 hover:bg-[color:var(--danger-soft)] focus:outline-none focus:ring-4 focus:ring-rose-500/10 active:scale-[0.99]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[color:var(--danger-soft)] text-[color:var(--danger)]">
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
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-2.5 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--primary-border)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--primary)] focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[color:var(--danger)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-950/15 transition hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-rose-500/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoggingOut ? "Logging out" : "Logout"}
            </button>
          </div>
        }
        >
        <div className="space-y-3">
          <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
            This will end your current session on this device.
          </p>
        </div>
      </Modal>
    </>
  );
}
