import bcrypt from "bcrypt";

import { createAuthCookieValue, signAuthToken } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";
import { enforceAuthRateLimit } from "@/lib/rate-limit";
import {
  createGenericServerErrorResponse,
  createNoStoreJsonResponse,
  enforceTrustedOrigin,
  JSON_BODY_LIMITS,
  logSecurityEvent,
  readJsonBody,
} from "@/lib/security";
import { loginSchema } from "@/lib/validations/auth";

export const runtime = "nodejs";

const DUMMY_BCRYPT_HASH = "$2b$12$2yzu5E0oVGD8shzTn5wCMeSn7XYkWn8XtG0y8qQTUS9QizuhapzT2";

function createValidationErrorResponse(message: string, fieldErrors: Record<string, string[]>) {
  return createNoStoreJsonResponse(
    {
      success: false,
      message,
      errors: {
        formErrors: [message],
        fieldErrors,
      },
    },
    { status: 400 },
  );
}

function createInvalidCredentialsResponse() {
  return createNoStoreJsonResponse(
    {
      success: false,
      message: "Invalid email or password.",
    },
    { status: 401 },
  );
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

    const validationResult = loginSchema.safeParse(parsedBody.body);

    if (!validationResult.success) {
      return createValidationErrorResponse("Validation failed.", validationResult.error.flatten().fieldErrors);
    }

    const { email, password } = validationResult.data;

    const rateLimitResponse = await enforceAuthRateLimit(request, "login", email);

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    const passwordHash = user?.password ?? DUMMY_BCRYPT_HASH;
    const passwordMatches = await bcrypt.compare(password, passwordHash);

    if (!user || !passwordMatches) {
      logSecurityEvent("auth.login_failed");
      return createInvalidCredentialsResponse();
    }

    const token = await signAuthToken(user.id, user.email);

    const response = createNoStoreJsonResponse(
      {
        success: true,
        message: "Login successful.",
      },
      { status: 200 },
    );

    response.cookies.set(createAuthCookieValue(token));

    return response;
  } catch (error) {
    console.error("Login error:", error);
    console.error("Login API error:", error);
    return createGenericServerErrorResponse();
  }
}
