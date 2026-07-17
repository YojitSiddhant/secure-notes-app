import { CalendarDays, Edit3, LayoutGrid, PencilLine, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { NoteItem } from "@/services/notes.service";
import {
  badgeClassName,
  cardShellInteractiveClassName,
  helperTextClassName,
  iconButtonClassName,
} from "@/components/ui/styles";

type NoteCardProps = {
  note: NoteItem;
  onEdit: (note: NoteItem) => void;
  onDelete: (note: NoteItem) => void;
  variant?: "grid" | "list";
};

const priorityStyles: Record<
  NoteItem["priority"],
  { label: string; className: string; shellClassName: string; accentClassName: string }
> = {
  HIGH: {
    label: "High",
    className:
      "bg-[color:var(--danger-soft)] text-[color:var(--danger)] ring-[color:var(--danger-soft)]",
    shellClassName:
      "border-[color:rgba(219,49,81,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(255,247,248,0.92))]",
    accentClassName: "bg-[linear-gradient(180deg,rgba(219,49,81,0.16),rgba(219,49,81,0.04))]",
  },
  MEDIUM: {
    label: "Medium",
    className:
      "bg-[color:var(--warning-soft)] text-[color:var(--warning)] ring-[color:var(--warning-soft)]",
    shellClassName:
      "border-[color:rgba(199,109,11,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(255,250,243,0.9))]",
    accentClassName: "bg-[linear-gradient(180deg,rgba(199,109,11,0.16),rgba(199,109,11,0.04))]",
  },
  LOW: {
    label: "Low",
    className:
      "bg-[color:var(--success-soft)] text-[color:var(--success)] ring-[color:var(--success-soft)]",
    shellClassName:
      "border-[color:rgba(23,130,95,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(243,251,248,0.92))]",
    accentClassName: "bg-[linear-gradient(180deg,rgba(23,130,95,0.16),rgba(23,130,95,0.04))]",
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function NoteCard({ note, onEdit, onDelete, variant = "grid" }: NoteCardProps) {
  const priority = priorityStyles[note.priority];

  if (variant === "list") {
    return (
      <article
        className={cn(
          "group overflow-hidden rounded-[1.75rem] border p-4 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.24)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[color:var(--primary-border)] hover:shadow-[0_28px_90px_-56px_rgba(56,86,240,0.24)] sm:p-5",
          cardShellInteractiveClassName,
          priority.shellClassName
        )}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={cn(badgeClassName, priority.className)}>{priority.label}</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1 text-xs font-medium text-[color:var(--muted-foreground)]">
                <LayoutGrid className="h-3.5 w-3.5" />
                Compact view
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-[1.05rem] font-semibold leading-6 tracking-tight text-[color:var(--foreground)] sm:text-[1.1rem]">
                {note.title}
              </h3>
              <p
                className={cn(helperTextClassName, "line-clamp-3 max-w-3xl")}
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                  overflow: "hidden",
                }}
              >
                {note.description}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--primary-soft)] text-[color:var(--primary)]">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                    Created
                  </p>
                  <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">
                    {formatDate(note.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--info-soft)] text-[color:var(--info)]">
                  <PencilLine className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                    Updated
                  </p>
                  <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">
                    {formatDate(note.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end xl:self-start">
            <button
              type="button"
              onClick={() => onEdit(note)}
              className={iconButtonClassName}
              aria-label={`Edit note ${note.title}`}
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(note)}
              className={cn(
                iconButtonClassName,
                "hover:border-[color:var(--danger-soft)] hover:bg-[color:var(--danger-soft)] hover:text-[color:var(--danger)] focus:ring-4 focus:ring-rose-500/10"
              )}
              aria-label={`Delete note ${note.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex h-full min-h-[18rem] flex-col overflow-hidden p-5 transition-all duration-150 ease-out hover:-translate-y-1 sm:min-h-[20rem] sm:p-6",
        cardShellInteractiveClassName,
        priority.shellClassName
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-1.5",
          priority.accentClassName
        )}
      />

      <div className="flex items-start justify-between gap-3">
        <span className={cn(badgeClassName, priority.className)}>{priority.label}</span>

        <div className="flex items-center gap-2 opacity-100 transition md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(note)}
            className={iconButtonClassName}
            aria-label={`Edit note ${note.title}`}
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(note)}
            className={cn(
              iconButtonClassName,
              "hover:border-[color:var(--danger-soft)] hover:bg-[color:var(--danger-soft)] hover:text-[color:var(--danger)] focus:ring-4 focus:ring-rose-500/10"
            )}
            aria-label={`Delete note ${note.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <h3 className="text-[1.05rem] font-semibold leading-6 tracking-tight text-[color:var(--foreground)] sm:text-[1.1rem]">
          {note.title}
        </h3>
        <p
          className={cn(helperTextClassName, "line-clamp-5")}
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 5,
            overflow: "hidden",
          }}
        >
          {note.description}
        </p>
      </div>

      <div className="mt-6 grid gap-3 border-t border-[color:var(--border)] pt-4 text-xs text-[color:var(--muted-foreground)] sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--primary-soft)] text-[color:var(--primary)]">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
              Created
            </p>
            <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">
              {formatDate(note.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--info-soft)] text-[color:var(--info)]">
            <PencilLine className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
              Updated
            </p>
            <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">
              {formatDate(note.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
