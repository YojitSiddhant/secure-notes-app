"use client";

import { useMutation } from "@tanstack/react-query";
import { authService, type SignupRequest } from "@/services/auth.service";

export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupRequest) => authService.signup(payload),
  });
}
