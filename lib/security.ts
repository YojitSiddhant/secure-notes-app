import { createHash, randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { env } from "@/lib/env";

export const AUTH_COOKIE_BASE_NAME = "auth_token";
export const AUTH_COOKIE_PERSISTENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
export const AUTH_JWT_AUDIENCE = "secure-notes-app-web";
export const AUTH_JWT_ISSUER = "secure-notes-app";
export const JWT_ALGORITHM = "HS256";
export const JSON_BODY_LIMITS = {
  auth: 8 * 1024,
  note: 16 * 1024,
} as const;

const weakSignupPasswords = new Set([
  "password",
  "password1",
  "password123",
  "1234567890",
  "qwerty123",
  "letmein123",
  "welcome123",
  "admin12345",
]);

function parseCsvOrigins(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function getAuthCookieName() {
  return env.NODE_ENV === "production" ? "__Host-auth_token" : AUTH_COOKIE_BASE_NAME;
}

export function getAuthCookieOptions(options?: { persistent?: boolean }) {
  const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  if (options?.persistent) {
    return {
      ...cookieOptions,
      maxAge: AUTH_COOKIE_PERSISTENT_MAX_AGE_SECONDS,
    };
  }

  return cookieOptions;
}

export function createNoStoreJsonResponse(
  payload: Record<string, unknown>,
  init?: ResponseInit,
) {
  const response = NextResponse.json(payload, init);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export function createGenericServerErrorResponse() {
  return createNoStoreJsonResponse(
    {
      success: false,
      message: "An unexpected error occurred.",
    },
    { status: 500 },
  );
}

export function createConfigurationErrorResponse(message = "Server configuration error.") {
  return createNoStoreJsonResponse(
    {
      success: false,
      message,
    },
    { status: 500 },
  );
}

export function createForbiddenResponse(message = "Forbidden.") {
  return createNoStoreJsonResponse(
    {
      success: false,
      message,
    },
    { status: 403 },
  );
}

export function createUnauthorizedResponse(message = "Unauthorized.") {
  return createNoStoreJsonResponse(
    {
      success: false,
      message,
    },
    { status: 401 },
  );
}

export function createRateLimitExceededResponse() {
  const response = createNoStoreJsonResponse(
    {
      success: false,
      message: "Too many attempts. Please try again later.",
    },
    { status: 429 },
  );
  response.headers.set("Retry-After", "60");
  return response;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeUserString(value: string) {
  return value.trim();
}

export function isJsonRequest(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  return contentType.includes("application/json");
}

export async function readJsonBody<T>(
  request: Request,
  options: { maxBytes: number; requireContentType?: boolean },
): Promise<{ ok: true; body: T } | { ok: false; response: Response }> {
  if (options.requireContentType !== false && !isJsonRequest(request)) {
    return {
      ok: false,
      response: createNoStoreJsonResponse(
        {
          success: false,
          message: "Unsupported media type.",
        },
        { status: 415 },
      ),
    };
  }

  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader ? Number(contentLengthHeader) : Number.NaN;

  if (Number.isFinite(contentLength) && contentLength > options.maxBytes) {
    return {
      ok: false,
      response: createNoStoreJsonResponse(
        {
          success: false,
          message: "Request body is too large.",
        },
        { status: 413 },
      ),
    };
  }

  const rawBody = await request.text();

  if (rawBody.length > options.maxBytes) {
    return {
      ok: false,
      response: createNoStoreJsonResponse(
        {
          success: false,
          message: "Request body is too large.",
        },
        { status: 413 },
      ),
    };
  }

  try {
    return {
      ok: true,
      body: JSON.parse(rawBody) as T,
    };
  } catch {
    return {
      ok: false,
      response: createNoStoreJsonResponse(
        {
          success: false,
          message: "Invalid JSON body.",
        },
        { status: 400 },
      ),
    };
  }
}

export function logSecurityEvent(event: string, details?: Record<string, unknown>) {
  if (details) {
    console.warn(`Security event: ${event}`, details);
    return;
  }

  console.warn(`Security event: ${event}`);
}

export function getRequestOrigin(request: Request) {
  return new URL(request.url).origin;
}

export function getTrustedOrigins() {
  const origins = new Set<string>();

  if (env.APP_ORIGIN) {
    origins.add(env.APP_ORIGIN);
  }

  for (const origin of parseCsvOrigins(env.TRUSTED_ORIGINS)) {
    origins.add(origin);
  }

  return origins;
}

function isLocalDevelopmentOrigin(origin: string) {
  try {
    const url = new URL(origin);
    return ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
}

export function isTrustedRequestOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const requestOrigin = getRequestOrigin(request);

  if (!origin) {
    return env.NODE_ENV !== "production";
  }

  if (origin === requestOrigin) {
    return true;
  }

  if (getTrustedOrigins().has(origin)) {
    return true;
  }

  if (env.NODE_ENV !== "production" && isLocalDevelopmentOrigin(origin)) {
    return true;
  }

  return false;
}

export function enforceTrustedOrigin(request: Request) {
  if (isTrustedRequestOrigin(request)) {
    return null;
  }

  return createForbiddenResponse("Invalid origin.");
}

export function getRequestIp(request: Request) {
  const headers = [
    request.headers.get("x-vercel-forwarded-for"),
    request.headers.get("x-forwarded-for"),
    request.headers.get("x-real-ip"),
    request.headers.get("cf-connecting-ip"),
  ];

  for (const header of headers) {
    if (!header) {
      continue;
    }

    const candidate = header.split(",")[0]?.trim();

    if (candidate) {
      return candidate;
    }
  }

  return "unknown";
}

export function buildRateLimitKey(scope: string, request: Request, subject?: string) {
  const parts = [`scope:${scope}`, `ip:${getRequestIp(request)}`];

  if (subject) {
    parts.push(`subject:${createHash("sha256").update(subject).digest("hex")}`);
  }

  return parts.join("|");
}

export function isStrongSignupPassword(password: string) {
  return !weakSignupPasswords.has(password.trim().toLowerCase());
}

export function isSafeInternalRedirectPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return false;
  }

  try {
    const decoded = decodeURIComponent(value);

    if (!decoded.startsWith("/") || decoded.startsWith("//")) {
      return false;
    }

    return !decoded.includes("://");
  } catch {
    return false;
  }
}

export function getSafeInternalRedirectPath(
  value: string | null | undefined,
  fallback = "/dashboard",
) : string {
  return isSafeInternalRedirectPath(value) && typeof value === "string" ? value : fallback;
}

export function newRequestId() {
  return randomUUID();
}
