"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { currentUserQueryKey } from "@/hooks/useCurrentUser";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onMutate: () => {
      queryClient.removeQueries({ queryKey: currentUserQueryKey });
      router.replace("/login");
    },
  });
}
