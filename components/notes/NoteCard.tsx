import { CalendarDays, Edit3, PencilLine, Trash2 } from "lucide-react";
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
  animationDelay?: string;
};

const priorityStyles: Record<
  NoteItem["priority"],
  { label: string; className: string; shellClassName: string }
> = {
  HIGH: {
    label: "High",
    className: "bg-[color:var(--danger-soft)] text-[color:var(--danger)] ring-[color:var(--danger-soft)]",
    shellClassName: "border-[color:var(--border)] bg-[color:var(--surface-elevated)]",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-[color:var(--warning-soft)] text-[color:var(--warning)] ring-[color:var(--warning-soft)]",
    shellClassName: "border-[color:var(--border)] bg-[color:var(--surface-elevated)]",
  },
  LOW: {
    label: "Low",
    className: "bg-[color:var(--success-soft)] text-[color:var(--success)] ring-[color:var(--success-soft)]",
    shellClassName: "border-[color:var(--border)] bg-[color:var(--surface-elevated)]",
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function NoteCard({ note, onEdit, onDelete, animationDelay }: NoteCardProps) {
  const priority = priorityStyles[note.priority];

  return (
      <article
      className={cn(
        "ui-animate-rise-in group relative flex h-full min-h-[16rem] flex-col overflow-hidden p-5 sm:min-h-[18rem] sm:p-6",
        cardShellInteractiveClassName,
        priority.shellClassName
      )}
      style={animationDelay ? { animationDelay } : undefined}
    >
        <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            badgeClassName,
            priority.className
          )}
        >
          {priority.label}
        </span>

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
        <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--primary-soft)] text-[color:var(--primary)]">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
              Created
            </p>
            <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">{formatDate(note.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--info-soft)] text-[color:var(--info)]">
            <PencilLine className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
              Updated
            </p>
            <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">{formatDate(note.updatedAt)}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
