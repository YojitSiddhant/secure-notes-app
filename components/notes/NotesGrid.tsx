import type { NoteItem } from "@/services/notes.service";
import { NoteCard } from "@/components/notes/NoteCard";

type NotesGridProps = {
  notes: NoteItem[];
  onEdit: (note: NoteItem) => void;
  onDelete: (note: NoteItem) => void;
};

export function NotesGrid({ notes, onEdit, onDelete }: NotesGridProps) {
  return (
    <div
      className="grid gap-4 sm:gap-5"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))",
      }}
    >
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
