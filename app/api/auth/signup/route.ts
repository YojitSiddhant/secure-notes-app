import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/prisma";
import { enforceAuthRateLimit } from "@/lib/rate-limit";
import {
  createNoStoreJsonResponse,
  enforceTrustedOrigin,
  logSecurityEvent,
  readJsonBody,
  JSON_BODY_LIMITS,
} from "@/lib/security";
import { signUpSchema } from "@/lib/validations/auth";

export const runtime = "nodejs";

const SALT_ROUNDS = 12;

function isPrismaUniqueConstraintError(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  return "code" in error && (error as { code?: unknown }).code === "P2002";
}

export async function POST(request: Request) {
  try {
    const originResponse = enforceTrustedOrigin(request);

    if (originResponse) {
      return originResponse;
    }

    const parsedBody = await readJsonBody<unknown>(request, {
      maxBytes: JSON_BODY_LIMITS.auth,
    });

    if (!parsedBody.ok) {
      return parsedBody.response;
    }

    const validationResult = signUpSchema.safeParse(parsedBody.body);

    if (!validationResult.success) {
      return createNoStoreJsonResponse(
        {
          success: false,
          message: "Validation failed.",
          errors: validationResult.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { name, email, password } = validationResult.data;

    const rateLimitResponse = await enforceAuthRateLimit(request, "signup", email);

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const prisma = getPrismaClient();
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      logSecurityEvent("auth.signup_duplicate_email");
      return createNoStoreJsonResponse(
        {
          success: false,
          message: "Account already exists.",
        },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return createNoStoreJsonResponse(
      {
        success: true,
        message: "Account created successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    if (isPrismaUniqueConstraintError(error)) {
      return createNoStoreJsonResponse(
        {
          success: false,
          message: "Account already exists.",
        },
        { status: 409 },
      );
    }

    console.error("Signup error:", error);
    console.error("Signup API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack:
          process.env.NODE_ENV !== "production" && error instanceof Error
            ? error.stack
            : undefined,
      },
      { status: 500 },
    );
  }
}
