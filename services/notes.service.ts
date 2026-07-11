import type {
  CreateNoteInput,
  ListNotesQueryInput,
  UpdateNoteInput,
} from "@/lib/validations/note";
import { requestJson, type BackendSuccessPayload } from "@/services/http";

export type NotePriority = "HIGH" | "MEDIUM" | "LOW";

export type NoteItem = {
  id: string;
  title: string;
  description: string;
  priority: NotePriority;
  createdAt: string;
  updatedAt: string;
};

export type DashboardStats = {
  totalNotes: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
};

export type NotesResponse = BackendSuccessPayload<{
  notes: NoteItem[];
}>;

export type NoteMutationResponse = BackendSuccessPayload<{
  note: NoteItem;
}>;

export type CreateNoteRequest = CreateNoteInput;
export type UpdateNoteRequest = UpdateNoteInput;
export type NotesFilters = Pick<ListNotesQueryInput, "search" | "priority">;

export function buildNotesQueryString(filters: NotesFilters = {}) {
  const params = new URLSearchParams();

  if (filters.search && filters.search.trim().length > 0) {
    params.set("search", filters.search.trim());
  }

  if (filters.priority) {
    params.set("priority", filters.priority);
  }

  return params.toString();
}

export const notesService = {
  getDashboardStats() {
    return requestJson<DashboardStats>("/api/dashboard", {
      method: "GET",
    });
  },
  getNotes(filters: NotesFilters = {}) {
    const queryString = buildNotesQueryString(filters);

    return requestJson<NotesResponse>(
      queryString ? `/api/notes?${queryString}` : "/api/notes",
      {
        method: "GET",
      }
    );
  },
  createNote(payload: CreateNoteRequest) {
    return requestJson<NoteMutationResponse>("/api/notes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateNote(noteId: string, payload: UpdateNoteRequest) {
    return requestJson<NoteMutationResponse>(`/api/notes/${noteId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  deleteNote(noteId: string) {
    return requestJson<{ success: true; message: string }>(
      `/api/notes/${noteId}`,
      {
        method: "DELETE",
      }
    );
  },
};
