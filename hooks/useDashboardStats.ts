"use client";

import { useQuery } from "@tanstack/react-query";
import { notesService } from "@/services/notes.service";

export const dashboardQueryKey = ["dashboard-stats"] as const;

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardQueryKey,
    queryFn: () => notesService.getDashboardStats(),
  });
}
