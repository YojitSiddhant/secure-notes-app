"use client";

import { useEffect } from "react";
import { Loader2, Lock, PenSquare, TextCursorInput } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createNoteSchema } from "@/lib/validations/note";
import { Modal } from "@/components/shared/Modal";
import { cn } from "@/lib/cn";
import type { NoteItem, NotePriority } from "@/services/notes.service";
import { ApiError } from "@/services/http";
import { useCreateNote } from "@/hooks/useCreateNote";
import { useUpdateNote } from "@/hooks/useUpdateNote";
import {
  fieldClassName,
  helperTextClassName,
  labelClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  selectClassName,
  textareaClassName,
} from "@/components/ui/styles";

const noteFormSchema = createNoteSchema;

type NoteFormValues = z.infer<typeof noteFormSchema>;

type NoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: NoteItem | null;
};

const priorityOptions: Array<{ value: NotePriority; label: string }> = [
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

export function NoteDialog({ open, onOpenChange, note }: NoteDialogProps) {
  const isEditing = Boolean(note);
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "HIGH",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      title: note?.title ?? "",
      description: note?.description ?? "",
      priority: note?.priority ?? "HIGH",
    });
    clearErrors();
  }, [clearErrors, note, open, reset]);

  const onSubmit = async (values: NoteFormValues) => {
    clearErrors();

    try {
      if (note) {
        await updateMutation.mutateAsync({
          noteId: note.id,
          payload: values,
        });
      } else {
        await createMutation.mutateAsync(values);
      }

      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError) {
        Object.entries(error.fieldErrors).forEach(([field, messages]) => {
          const message = messages[0];

          if (field === "title" || field === "description" || field === "priority") {
            setError(field as keyof NoteFormValues, {
              type: "server",
              message,
            });
          }
        });

        setError("root", {
          type: "server",
          message: error.formErrors[0] ?? error.message,
        });
      } else if (error instanceof Error) {
        setError("root", {
          type: "server",
          message: error.message,
        });
      }
    }
  };

  return (
    <Modal
      open={open}
      title={isEditing ? "Edit Note" : "Create Note"}
      description={
        isEditing
          ? "Update the title, description, or priority of this note."
          : "Capture a new thought, task, or reminder in your workspace."
      }
      onClose={() => onOpenChange(false)}
      maxWidthClassName="max-w-2xl lg:max-w-3xl"
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        {errors.root?.message ? (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-2xl border border-[color:var(--danger-soft)] bg-[color:var(--surface)] px-4 py-3 text-sm leading-6 text-[color:var(--danger)]"
          >
            {errors.root.message}
          </div>
        ) : null}

        <div className="grid gap-5">
          <div className="space-y-2.5">
            <label htmlFor="note-title" className={labelClassName}>
              Title
            </label>
            <div className="relative">
              <PenSquare className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
              <input
                id="note-title"
                type="text"
                placeholder="Note title"
                aria-invalid={errors.title ? "true" : "false"}
                aria-describedby={errors.title ? "note-title-error" : "note-title-help"}
                className={cn(
                  fieldClassName,
                  "pl-11",
                  errors.title &&
                    "border-[color:var(--danger)] focus:border-rose-500 focus:ring-rose-500/10"
                )}
                {...register("title")}
              />
            </div>
            {errors.title ? (
              <p id="note-title-error" className="text-sm text-[color:var(--danger)]">
                {errors.title.message}
              </p>
            ) : (
              <p id="note-title-help" className={helperTextClassName}>
                Keep it concise and specific.
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            <label htmlFor="note-description" className={labelClassName}>
              Description
            </label>
            <div className="relative">
              <TextCursorInput className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-indigo-500" />
              <textarea
                id="note-description"
                rows={8}
                placeholder="Write your note here..."
                aria-invalid={errors.description ? "true" : "false"}
                aria-describedby={
                  errors.description ? "note-description-error" : "note-description-help"
                }
                className={cn(
                  textareaClassName,
                  "pl-11",
                  errors.description &&
                    "border-[color:var(--danger)] focus:border-rose-500 focus:ring-rose-500/10"
                )}
                {...register("description")}
              />
            </div>
            {errors.description ? (
              <p id="note-description-error" className="text-sm text-[color:var(--danger)]">
                {errors.description.message}
              </p>
            ) : (
              <p id="note-description-help" className={helperTextClassName}>
                Add any details you want to remember later.
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            <label htmlFor="note-priority" className={labelClassName}>
              Priority
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500" />
              <select
                id="note-priority"
                aria-invalid={errors.priority ? "true" : "false"}
                aria-describedby={
                  errors.priority ? "note-priority-error" : "note-priority-help"
                }
                className={cn(
                  selectClassName,
                  "pl-11 pr-4",
                  errors.priority &&
                    "border-[color:var(--danger)] focus:border-rose-500 focus:ring-rose-500/10"
                )}
                {...register("priority")}
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.priority ? (
              <p id="note-priority-error" className="text-sm text-[color:var(--danger)]">
                {errors.priority.message}
              </p>
            ) : (
              <p id="note-priority-help" className={helperTextClassName}>
                Set how prominently this note should stand out.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={cn(secondaryButtonClassName, "w-full sm:w-auto")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            aria-busy={isSubmitting || createMutation.isPending || updateMutation.isPending}
            className={cn(primaryButtonClassName, "w-full sm:w-auto")}
          >
            {isSubmitting || createMutation.isPending || updateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEditing ? "Updating" : "Creating"}
              </>
            ) : isEditing ? (
              "Update Note"
            ) : (
              "Create Note"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
