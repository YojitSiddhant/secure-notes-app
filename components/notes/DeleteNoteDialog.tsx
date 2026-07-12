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

export function DeleteNoteDialog({
  open,
  onOpenChange,
  note,
}: DeleteNoteDialogProps) {
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
      title="Delete Note"
      description="This action cannot be undone."
      onClose={() => onOpenChange(false)}
      maxWidthClassName="max-w-xl"
    >
      <div className="space-y-5">
        {errorMessage ? (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-rose-700"
          >
            {errorMessage}
          </div>
        ) : null}

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            Selected Note
          </p>
          <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
            {note?.title ?? "Untitled note"}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {note?.description ?? "The note will be permanently removed."}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-900/5 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending || !note}
            aria-busy={deleteMutation.isPending}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/20 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Note
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
