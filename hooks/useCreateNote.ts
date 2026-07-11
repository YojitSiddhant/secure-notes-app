"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notesService, type CreateNoteRequest } from "@/services/notes.service";
import { dashboardQueryKey } from "@/hooks/useDashboardStats";
import { notesQueryKeyPrefix } from "@/hooks/useNotes";

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNoteRequest) => notesService.createNote(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notesQueryKeyPrefix });
      await queryClient.invalidateQueries({ queryKey: dashboardQueryKey });
    },
  });
}
