import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";
import type { NotePriority } from "@/services/notes.service";
import {
  fieldClassName,
  pageSubtitleClassName,
  primaryButtonClassName,
  sectionShellClassName,
  sectionTitleClassName,
} from "@/components/ui/styles";

export type NotesPriorityFilter = NotePriority | "ALL";

type NotesToolbarProps = {
  search: string;
  priority: NotesPriorityFilter;
  onSearchChange: (value: string) => void;
  onPriorityChange: (value: NotesPriorityFilter) => void;
  onCreateClick: () => void;
  totalNotes: number;
};

export function NotesToolbar({
  search,
  priority,
  onSearchChange,
  onPriorityChange,
  onCreateClick,
  totalNotes,
}: NotesToolbarProps) {
  return (
    <section className={cn(sectionShellClassName, "p-4 sm:p-5 lg:p-6")}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h2 className={sectionTitleClassName}>Notes</h2>
          <p className={pageSubtitleClassName}>
            {totalNotes.toLocaleString()} note
            {totalNotes === 1 ? "" : "s"} in your workspace
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateClick}
          className={cn(primaryButtonClassName, "w-full sm:w-auto")}
        >
          <Plus className="h-4 w-4" />
          Create Note
        </button>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(13rem,18rem)]">
        <label className="relative block">
          <span className="pointer-events-none absolute left-4 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl bg-[color:var(--primary-soft)] text-[color:var(--primary)]">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search notes by title or description"
            aria-label="Search notes"
            className={cn(fieldClassName, "pl-14")}
          />
        </label>

        <label className="relative block">
          <span className="pointer-events-none absolute left-4 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl bg-[color:var(--primary-soft)] text-[color:var(--primary)]">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <select
            value={priority}
            onChange={(event) =>
              onPriorityChange(event.target.value as NotesPriorityFilter)
            }
            aria-label="Filter notes by priority"
            className={cn(fieldClassName, "appearance-none pl-14 pr-4 font-medium")}
          >
            <option value="ALL">All</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </label>
      </div>
    </section>
  );
}
