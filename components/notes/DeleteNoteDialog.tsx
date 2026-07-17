"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Modal } from "@/components/shared/Modal";
import { ApiError } from "@/services/http";
import type { NoteItem } from "@/services/notes.service";
import { useDeleteNote } from "@/hooks/useDeleteNote";

type DeleteNoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: NoteItem | null;
};

export function DeleteNoteDialog({ open, onOpenChange, note }: DeleteNoteDialogProps) {
  const deleteMutation = useDeleteNote();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!note) {
      return;
    }

    setErrorMessage(null);

    try {
      await deleteMutation.mutateAsync(note.id);
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.formErrors[0] ?? error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <Modal
      open={open}
      title="Delete note"
      description="This action cannot be undone."
      onClose={() => onOpenChange(false)}
      maxWidthClassName="max-w-2xl"
    >
      <div className="space-y-5">
        {errorMessage ? (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-2xl border border-[color:var(--danger-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,247,248,0.96))] px-4 py-3 text-sm text-[color:var(--danger)]"
          >
            {errorMessage}
          </div>
        ) : null}

        <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,255,0.94))] p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.22)]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--danger-soft)] text-[color:var(--danger)]">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Selected note
              </p>
              <p className="mt-2 text-lg font-semibold tracking-tight text-[color:var(--foreground)]">
                {note?.title ?? "Untitled note"}
              </p>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
                {note?.description ?? "The note will be permanently removed."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-2.5 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--primary-border)] hover:bg-[color:var(--surface-muted)] focus:outline-none focus:ring-4 focus:ring-slate-900/5 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending || !note}
            aria-busy={deleteMutation.isPending}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--danger),#b61f3d)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_-22px_rgba(219,49,81,0.7)] transition hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-rose-500/20 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete note
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
