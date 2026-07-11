import type { LoginInput, SignUpInput } from "@/lib/validations/auth";
import { type BackendSuccessPayload, requestJson } from "@/services/http";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type CurrentUserResponse = BackendSuccessPayload<{
  user: AuthUser;
}>;

export type LoginResponse = BackendSuccessPayload<Record<string, never>>;
export type SignupResponse = BackendSuccessPayload<Record<string, never>>;
export type LogoutResponse = BackendSuccessPayload<Record<string, never>>;

export type SignupRequest = Pick<SignUpInput, "name" | "email" | "password">;
export { ApiError } from "@/services/http";

export const authService = {
  login(payload: LoginInput) {
    return requestJson<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  signup(payload: SignupRequest) {
    return requestJson<SignupResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  logout() {
    return requestJson<LogoutResponse>("/api/auth/logout", {
      method: "POST",
    });
  },
  me() {
    return requestJson<CurrentUserResponse>("/api/auth/me", {
      method: "GET",
    });
  },
};
