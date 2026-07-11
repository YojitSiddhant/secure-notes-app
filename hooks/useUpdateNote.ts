"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  notesService,
  type UpdateNoteRequest,
} from "@/services/notes.service";
import { dashboardQueryKey } from "@/hooks/useDashboardStats";
import { notesQueryKeyPrefix } from "@/hooks/useNotes";

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      noteId,
      payload,
    }: {
      noteId: string;
      payload: UpdateNoteRequest;
    }) => notesService.updateNote(noteId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notesQueryKeyPrefix });
      await queryClient.invalidateQueries({ queryKey: dashboardQueryKey });
    },
  });
}
