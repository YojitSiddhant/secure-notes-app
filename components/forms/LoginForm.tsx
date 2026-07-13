"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/lib/validations/auth";
import { cn } from "@/lib/cn";
import {
  fieldClassName,
  helperTextClassName,
  labelClassName,
  primaryButtonClassName,
} from "@/components/ui/styles";

const loginFormSchema = loginSchema.extend({
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

type AuthDebugErrorResponse = {
  error?: unknown;
  stack?: unknown;
  message?: string;
  errors?: {
    formErrors?: string[];
    fieldErrors?: Record<string, string[]>;
  };
};

function getDebugErrorMessage(responseBody: AuthDebugErrorResponse | null, fallback: string) {
  if (typeof responseBody?.error === "string" && responseBody.error.trim().length > 0) {
    return responseBody.error;
  }

  if (typeof responseBody?.message === "string" && responseBody.message.trim().length > 0) {
    return responseBody.message;
  }

  return fallback;
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: LoginFormValues) => {
    clearErrors();

    const payload = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseBody = (await response.json().catch(() => null)) as AuthDebugErrorResponse | null;

      if (!response.ok) {
        if (typeof responseBody?.stack === "string" && responseBody.stack.trim().length > 0) {
          console.error(responseBody.stack);
        }

        if (responseBody?.errors?.fieldErrors) {
          Object.entries(responseBody.errors.fieldErrors).forEach(([field, messages]) => {
            const message = messages[0];

            if (field === "email" || field === "password") {
              setError(field, {
                type: "server",
                message,
              });
            }
          });
        }

        setError("root", {
          type: "server",
          message: getDebugErrorMessage(responseBody, response.statusText || "Request failed."),
        });
        return;
      }

      router.replace("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError("root", {
          type: "server",
          message: error.message,
        });
      }
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      {errors.root?.message ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-2xl border border-[color:var(--danger-soft)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--danger)]"
        >
          {errors.root.message}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="email" className={labelClassName}>
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : "email-help"}
            className={cn(
              fieldClassName,
              "pl-11",
              errors.email &&
                "border-[color:var(--danger)] focus:border-rose-500 focus:ring-rose-500/10"
            )}
            {...register("email")}
          />
        </div>
        {errors.email ? (
          <p id="email-error" className="text-sm text-[color:var(--danger)]">
            {errors.email.message}
          </p>
        ) : (
          <p id="email-help" className={helperTextClassName}>
            Use the email tied to your Notes account.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className={labelClassName}>
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : "password-help"}
            className={cn(
              fieldClassName,
              "pl-11 pr-12",
              errors.password &&
                "border-[color:var(--danger)] focus:border-rose-500 focus:ring-rose-500/10"
            )}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-[color:var(--muted-foreground)] transition hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)] focus:outline-none focus:ring-4 focus:ring-slate-900/5"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password ? (
          <p id="password-error" className="text-sm text-[color:var(--danger)]">
            {errors.password.message}
          </p>
        ) : (
          <p id="password-help" className={helperTextClassName}>
            Use your account password.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-[color:var(--muted-foreground)]">
          <input
            type="checkbox"
            className={cn(
              "h-4 w-4 rounded border-[color:var(--border)] text-[color:var(--foreground)] focus:ring-4 focus:ring-slate-900/5"
            )}
            {...register("rememberMe")}
            aria-label="Remember me"
          />
          <span>Remember Me</span>
        </label>

        <button
          type="button"
          className="text-sm font-medium text-[color:var(--primary)] underline-offset-4 transition hover:underline focus:outline-none focus:ring-4 focus:ring-slate-500/20"
          aria-label="Forgot password placeholder"
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(primaryButtonClassName, "w-full")}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing In
          </>
        ) : (
          "Sign In"
        )}
      </button>

      <p className="text-center text-sm text-[color:var(--muted-foreground)]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[color:var(--primary)] underline-offset-4 transition hover:underline focus:outline-none focus:ring-4 focus:ring-slate-500/20"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}
