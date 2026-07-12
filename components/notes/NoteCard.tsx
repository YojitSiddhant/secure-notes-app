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
};

const priorityStyles: Record<
  NoteItem["priority"],
  { label: string; className: string; shellClassName: string }
> = {
  HIGH: {
    label: "High",
    className: "bg-rose-100 text-rose-700 ring-rose-200",
    shellClassName: "border-slate-200 bg-white",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-amber-100 text-amber-700 ring-amber-200",
    shellClassName: "border-slate-200 bg-white",
  },
  LOW: {
    label: "Low",
    className: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    shellClassName: "border-slate-200 bg-white",
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const priority = priorityStyles[note.priority];

  return (
    <article
      className={cn(
        "group relative flex h-full min-h-[18rem] flex-col overflow-hidden p-5 sm:p-6",
        cardShellInteractiveClassName,
        priority.shellClassName
      )}
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
              "hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 focus:ring-4 focus:ring-rose-500/10"
            )}
            aria-label={`Delete note ${note.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <h3 className="text-[1.05rem] font-semibold leading-6 tracking-tight text-slate-950 sm:text-[1.1rem]">
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

      <div className="mt-6 grid gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Created
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">{formatDate(note.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
            <PencilLine className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Updated
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">{formatDate(note.updatedAt)}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
