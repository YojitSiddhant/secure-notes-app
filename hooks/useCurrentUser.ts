"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export const currentUserQueryKey = ["current-user"] as const;

export function useCurrentUser() {
  const query = useQuery({
    queryKey: currentUserQueryKey,
    queryFn: () => authService.me(),
  });

  return {
    ...query,
    user: query.data?.user ?? null,
  };
}
