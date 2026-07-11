"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notesService } from "@/services/notes.service";
import { dashboardQueryKey } from "@/hooks/useDashboardStats";
import { notesQueryKeyPrefix } from "@/hooks/useNotes";

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => notesService.deleteNote(noteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notesQueryKeyPrefix });
      await queryClient.invalidateQueries({ queryKey: dashboardQueryKey });
    },
  });
}
