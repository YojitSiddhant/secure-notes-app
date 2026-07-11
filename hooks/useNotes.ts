"use client";

import { useQuery } from "@tanstack/react-query";
import { notesService, type NotesFilters } from "@/services/notes.service";

export const notesQueryKeyPrefix = ["notes"] as const;
export const notesQueryKey = (filters: NotesFilters) =>
  [...notesQueryKeyPrefix, filters] as const;

export function useNotes(filters: NotesFilters) {
  return useQuery({
    queryKey: notesQueryKey(filters),
    queryFn: () => notesService.getNotes(filters),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}
