import type { NoteItem } from "@/services/notes.service";
import { NoteCard } from "@/components/notes/NoteCard";

type NotesGridProps = {
  notes: NoteItem[];
  onEdit: (note: NoteItem) => void;
  onDelete: (note: NoteItem) => void;
};

export function NotesGrid({ notes, onEdit, onDelete }: NotesGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
