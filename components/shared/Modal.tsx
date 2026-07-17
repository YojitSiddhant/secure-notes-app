"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidthClassName?: string;
};

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  maxWidthClassName = "max-w-2xl",
}: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center overflow-y-auto px-2 py-2 sm:items-center sm:px-4 sm:py-6 landscape:items-start landscape:px-3 landscape:py-3"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog overlay"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[10px] motion-safe:animate-[ui-fade-in_120ms_ease-out]"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
        className={cn(
          "relative flex w-full max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,255,0.96))] shadow-[0_48px_140px_-62px_rgba(15,23,42,0.45)] motion-safe:animate-[ui-pop-in_160ms_ease-out] sm:max-h-[calc(100dvh-3rem)] sm:rounded-[2rem]",
          maxWidthClassName
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,249,255,0.92))] px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <h2
              id="modal-title"
              className="text-base font-semibold tracking-tight text-[color:var(--foreground)] sm:text-lg"
            >
              {title}
            </h2>
            {description ? (
              <p id="modal-description" className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
                {description}
              </p>
            ) : null}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--muted-foreground)] transition hover:border-[color:var(--primary-border)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--primary)] focus:outline-none focus:ring-4 focus:ring-slate-500/20"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">{children}</div>

        {footer ? (
          <div className="border-t border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,250,255,0.98))] px-4 py-4 sm:px-6">
            {footer}
          </div>
        ) : null}
      </section>
    </div>
  );
}
