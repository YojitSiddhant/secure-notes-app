import { LayoutGrid, List, Plus, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";
import type { NotePriority } from "@/services/notes.service";
import {
  fieldClassName,
  helperTextClassName,
  primaryButtonClassName,
  sectionShellClassName,
} from "@/components/ui/styles";

export type NotesPriorityFilter = NotePriority | "ALL";

type NotesToolbarProps = {
  search: string;
  priority: NotesPriorityFilter;
  onSearchChange: (value: string) => void;
  onPriorityChange: (value: NotesPriorityFilter) => void;
  onCreateClick: () => void;
  totalNotes: number;
  viewMode: "grid" | "list";
  onViewModeChange: (value: "grid" | "list") => void;
};

export function NotesToolbar({
  search,
  priority,
  onSearchChange,
  onPriorityChange,
  onCreateClick,
  totalNotes,
  viewMode,
  onViewModeChange,
}: NotesToolbarProps) {
  return (
    <section className={cn(sectionShellClassName, "relative overflow-hidden p-4 sm:p-5 lg:p-6")}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-12 top-[-4rem] h-52 w-52 rounded-full bg-[color:var(--primary-soft)] blur-3xl" />
        <div className="absolute right-[-4rem] top-8 h-56 w-56 rounded-full bg-[color:var(--info-soft)] blur-3xl" />
      </div>

      <div className="relative flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--primary-border)] bg-[color:var(--primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--primary)]">
              Notes workspace
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-[2rem]">
                Notes
              </h2>
              <p className={helperTextClassName}>
                {totalNotes.toLocaleString()} note
                {totalNotes === 1 ? "" : "s"} in your workspace. Search, filter, and switch views
                without losing focus.
              </p>
            </div>
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

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
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
              onChange={(event) => onPriorityChange(event.target.value as NotesPriorityFilter)}
              aria-label="Filter notes by priority"
              className={cn(fieldClassName, "appearance-none pl-14 pr-4 font-medium")}
            >
              <option value="ALL">All priorities</option>
              <option value="HIGH">High priority</option>
              <option value="MEDIUM">Medium priority</option>
              <option value="LOW">Low priority</option>
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Use list view for scanning, or grid view for a more visual workspace.
          </p>

          <div className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] p-1 shadow-sm">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-all duration-150 ease-out focus:outline-none focus:ring-4 focus:ring-slate-500/20",
                viewMode === "grid"
                  ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-[0_12px_28px_-18px_rgba(56,86,240,0.55)]"
                  : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-all duration-150 ease-out focus:outline-none focus:ring-4 focus:ring-slate-500/20",
                viewMode === "list"
                  ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-[0_12px_28px_-18px_rgba(56,86,240,0.55)]"
                  : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
              )}
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
