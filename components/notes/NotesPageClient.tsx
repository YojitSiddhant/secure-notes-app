"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FileText, SearchX } from "lucide-react";
import { ProtectedAppShell } from "@/components/auth/ProtectedAppShell";
import { NotesSkeleton } from "@/components/notes/NotesSkeleton";
import { NotesToolbar, type NotesPriorityFilter } from "@/components/notes/NotesToolbar";
import { NotesGrid } from "@/components/notes/NotesGrid";
import { NoteDialog } from "@/components/notes/NoteDialog";
import { DeleteNoteDialog } from "@/components/notes/DeleteNoteDialog";
import { EmptyState, ErrorState } from "@/components/shared/FeedbackState";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useNotes } from "@/hooks/useNotes";
import type { NoteItem } from "@/services/notes.service";

function NotesContent() {
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<NotesPriorityFilter>("ALL");
  const [manualCreateOpen, setManualCreateOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [deletingNote, setDeletingNote] = useState<NoteItem | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const debouncedSearch = useDebouncedValue(search, 300);
  const isCreateRequested = searchParams.get("create") === "1";
  const isCreateOpen = manualCreateOpen || isCreateRequested;

  const filters = useMemo(
    () => ({
      search: debouncedSearch,
      priority: priority === "ALL" ? undefined : priority,
    }),
    [debouncedSearch, priority]
  );

  const notesQuery = useNotes(filters);
  const notes = notesQuery.data?.notes ?? [];
  const hasFilters = Boolean(search.trim()) || priority !== "ALL";

  if (notesQuery.isLoading) {
    return <NotesSkeleton />;
  }

  if (notesQuery.isError) {
    const description =
      notesQuery.error instanceof Error
        ? notesQuery.error.message
        : "Please try again.";

    return (
        <ErrorState
        icon={<SearchX className="h-7 w-7" />}
        title="We couldn&apos;t load your notes."
        description={description}
        action={
          <button
            type="button"
            onClick={() => notesQuery.refetch()}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] shadow-lg shadow-rose-950/10 transition hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-slate-500/20 sm:w-auto"
          >
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-7">
      <NotesToolbar
        search={search}
        priority={priority}
        onSearchChange={setSearch}
        onPriorityChange={setPriority}
        onCreateClick={() => setManualCreateOpen(true)}
        totalNotes={notes.length}
      />

      {notes.length > 0 ? (
        <NotesGrid
          notes={notes}
          onEdit={(note) => setEditingNote(note)}
          onDelete={(note) => setDeletingNote(note)}
        />
      ) : (
        <EmptyState
          icon={<FileText className="h-7 w-7" />}
          title={hasFilters ? "No matching notes found." : "You have no notes yet."}
          description={
            hasFilters
              ? "Try adjusting your search or priority filter to reveal matching notes."
              : "Start with a note from the toolbar above when you’re ready to capture something important."
          }
          action={
            hasFilters ? null : (
            <button
              type="button"
              onClick={() => setManualCreateOpen(true)}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] shadow-lg shadow-rose-950/10 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-slate-500/20 sm:w-auto"
            >
              Create Note
            </button>
          )
          }
        />
      )}

      <NoteDialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          if (open) {
            setManualCreateOpen(true);
            return;
          }

          setManualCreateOpen(false);

          if (isCreateRequested) {
            router.replace(pathname);
          }
        }}
      />

      <NoteDialog
        open={Boolean(editingNote)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingNote(null);
          }
        }}
        note={editingNote}
      />

      <DeleteNoteDialog
        key={deletingNote?.id ?? "closed"}
        open={Boolean(deletingNote)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingNote(null);
          }
        }}
        note={deletingNote}
      />
    </div>
  );
}

export function NotesPageClient() {
  return (
    <ProtectedAppShell loadingFallback={<NotesSkeleton />}>
      <NotesContent />
    </ProtectedAppShell>
  );
}
