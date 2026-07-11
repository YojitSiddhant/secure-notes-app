import { z } from "zod";

import { isStrongSignupPassword, normalizeEmail, normalizeUserString } from "@/lib/security";

// Schema for the data we expect when a user signs up.
export const signUpSchema = z
  .object({
    // Name must be present and reasonably sized for a profile name.
    name: z
      .string({ error: "Name is required." })
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name cannot exceed 100 characters.")
      .transform(normalizeUserString),
    // Email must be present and formatted like a real email address.
    email: z
      .string({ error: "Email is required." })
      .trim()
      .email("Please enter a valid email address.")
      .transform(normalizeEmail),
    // Password must be present and long enough to be safe.
    password: z
      .string({ error: "Password is required." })
      .min(12, "Password must be at least 12 characters.")
      .max(128, "Password cannot exceed 128 characters."),
  })
  .refine((value) => isStrongSignupPassword(value.password), {
    path: ["password"],
    message: "Please choose a less common password.",
  })
  .strict();

// Schema for the data we expect when a user logs in.
export const loginSchema = z
  .object({
    // Email must be present and formatted like a real email address.
    email: z
      .string({ error: "Email is required." })
      .trim()
      .email("Please enter a valid email address.")
      .transform(normalizeEmail),
    // Password must be present so the user can be authenticated.
    password: z
      .string({ error: "Password is required." })
      .min(1, "Password is required.")
      .max(128, "Password cannot exceed 128 characters."),
  })
  .strict();

// TypeScript type for validated sign-up data.
export type SignUpInput = z.infer<typeof signUpSchema>;

// TypeScript type for validated login data.
export type LoginInput = z.infer<typeof loginSchema>;
