"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { currentUserQueryKey } from "@/hooks/useCurrentUser";
import type { LoginInput } from "@/lib/validations/auth";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginInput) => authService.login(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
      router.replace("/dashboard");
    },
  });
}
