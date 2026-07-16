"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Mail, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/validations/auth";
import { cn } from "@/lib/cn";
import {
  fieldClassName,
  helperTextClassName,
  labelClassName,
  primaryButtonClassName,
} from "@/components/ui/styles";

const signUpFormSchema = signUpSchema
  .extend({
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

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

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      router.replace("/login");
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [router, successMessage]);

  const onSubmit = async (values: SignUpFormValues) => {
    clearErrors();
    setSuccessMessage(null);

    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    try {
      const response = await fetch("/api/auth/signup", {
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

            if (field === "name" || field === "email" || field === "password") {
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

      setSuccessMessage(responseBody?.message ?? "Account created successfully.");
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

      {successMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-[color:var(--success-soft)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--success)]"
        >
          {successMessage}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="name" className={labelClassName}>
          Full Name
        </label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : "name-help"}
            className={cn(
              fieldClassName,
              "pl-11",
              errors.name &&
                "border-[color:var(--danger)] focus:border-rose-500 focus:ring-rose-500/10"
            )}
            {...register("name")}
          />
        </div>
        {errors.name ? (
          <p id="name-error" className="text-sm text-[color:var(--danger)]">
            {errors.name.message}
          </p>
        ) : (
          <p id="name-help" className={helperTextClassName}>
            Use the name you want displayed in your workspace.
          </p>
        )}
      </div>

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
            autoComplete="new-password"
            placeholder="Create a password"
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
            Minimum 12 characters.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className={labelClassName}>
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm your password"
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : "confirm-password-help"
            }
            className={cn(
              fieldClassName,
              "pl-11 pr-12",
              errors.confirmPassword &&
                "border-[color:var(--danger)] focus:border-rose-500 focus:ring-rose-500/10"
            )}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((value) => !value)}
            className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-[color:var(--muted-foreground)] transition hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)] focus:outline-none focus:ring-4 focus:ring-slate-900/5"
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword ? (
          <p id="confirm-password-error" className="text-sm text-[color:var(--danger)]">
            {errors.confirmPassword.message}
          </p>
        ) : (
          <p id="confirm-password-help" className={helperTextClassName}>
            Re-enter your password to confirm it.
          </p>
        )}
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
            Creating Account
          </>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="text-center text-sm text-[color:var(--muted-foreground)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[color:var(--primary)] underline-offset-4 transition hover:underline focus:outline-none focus:ring-4 focus:ring-slate-500/20"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
