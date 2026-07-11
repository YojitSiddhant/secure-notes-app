"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Mail, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/validations/auth";
import { cn } from "@/lib/cn";
import { ApiError } from "@/services/auth.service";
import { useSignup } from "@/hooks/useSignup";
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

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const signupMutation = useSignup();

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
      const response = await signupMutation.mutateAsync(payload);
      setSuccessMessage(response.message);
    } catch (error) {
      if (error instanceof ApiError) {
        Object.entries(error.fieldErrors).forEach(([field, messages]) => {
          const message = messages[0];

          if (field === "name" || field === "email" || field === "password") {
            setError(field, {
              type: "server",
              message,
            });
          }
        });

        setError("root", {
          type: "server",
          message: error.formErrors[0] ?? error.message,
        });
        return;
      }

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
          className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-rose-700"
        >
          {errors.root.message}
        </div>
      ) : null}

      {successMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-700"
        >
          {successMessage}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="name" className={labelClassName}>
          Full Name
        </label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
                "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
            )}
            {...register("name")}
          />
        </div>
        {errors.name ? (
          <p id="name-error" className="text-sm text-rose-600">
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
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
                "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
            )}
            {...register("email")}
          />
        </div>
        {errors.email ? (
          <p id="email-error" className="text-sm text-rose-600">
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
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
                "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
            )}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-900/5"
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
          <p id="password-error" className="text-sm text-rose-600">
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
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
                "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
            )}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((value) => !value)}
            className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-900/5"
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
          <p id="confirm-password-error" className="text-sm text-rose-600">
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
        disabled={isSubmitting || signupMutation.isPending}
        className={primaryButtonClassName}
        aria-busy={isSubmitting || signupMutation.isPending}
      >
        {isSubmitting || signupMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Account
          </>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <button
          type="button"
          className="font-semibold text-indigo-700 underline-offset-4 transition hover:underline focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
          aria-label="Sign in placeholder"
        >
          Sign In
        </button>
      </p>
    </form>
  );
}
