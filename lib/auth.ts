import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { cookies } from "next/headers";

import { env } from "@/lib/env";
import {
  AUTH_JWT_AUDIENCE,
  AUTH_JWT_ISSUER,
  AUTH_COOKIE_BASE_NAME,
  getAuthCookieName,
  getAuthCookieOptions,
  JWT_ALGORITHM,
  logSecurityEvent,
} from "@/lib/security";

export type AuthTokenPayload = JWTPayload & {
  userId: string;
  email: string;
};

function getJwtSecretKey() {
  return new TextEncoder().encode(env.JWT_SECRET);
}

export function buildAuthTokenPayload(userId: string, email: string): AuthTokenPayload {
  return {
    userId,
    email,
    sub: userId,
    iss: AUTH_JWT_ISSUER,
    aud: AUTH_JWT_AUDIENCE,
  };
}

export async function signAuthToken(userId: string, email: string) {
  return new SignJWT({
    userId,
    email,
  })
    .setProtectedHeader({ alg: JWT_ALGORITHM, typ: "JWT" })
    .setSubject(userId)
    .setIssuer(AUTH_JWT_ISSUER)
    .setAudience(AUTH_JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecretKey());
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify<AuthTokenPayload>(token, getJwtSecretKey(), {
      algorithms: [JWT_ALGORITHM],
      issuer: AUTH_JWT_ISSUER,
      audience: AUTH_JWT_AUDIENCE,
    });

    if (typeof payload.sub !== "string" || typeof payload.userId !== "string" || payload.sub !== payload.userId) {
      return null;
    }

    if (typeof payload.email !== "string" || payload.email.trim().length === 0) {
      return null;
    }

    if (payload.iss !== AUTH_JWT_ISSUER || payload.aud !== AUTH_JWT_AUDIENCE) {
      return null;
    }

    if (typeof payload.iat !== "number" || typeof payload.exp !== "number") {
      return null;
    }

    return {
      ...payload,
      userId: payload.userId,
      email: payload.email,
    };
  } catch {
    logSecurityEvent("auth.invalid_token");
    return null;
  }
}

export async function getAuthenticatedUserFromToken(
  token: string | null | undefined,
): Promise<AuthTokenPayload | null> {
  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}

function readCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return null;
  }

  const parts = cookieHeader.split(";");

  for (const part of parts) {
    const [rawKey, ...rawValueParts] = part.split("=");
    if (rawKey?.trim() !== name) {
      continue;
    }

    return rawValueParts.join("=").trim();
  }

  return null;
}

export async function getAuthenticatedUserFromRequest(
  request: Request,
): Promise<AuthTokenPayload | null> {
  const token = readCookieValue(request.headers.get("cookie"), getAuthCookieName());
  return getAuthenticatedUserFromToken(token);
}

export async function getAuthenticatedUserFromCookies(): Promise<AuthTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAuthCookieName())?.value;

  return getAuthenticatedUserFromToken(token);
}

export function createAuthCookieValue(token: string, options?: { persistent?: boolean }) {
  return {
    name: getAuthCookieName(),
    value: token,
    ...getAuthCookieOptions(options),
  };
}

export const AUTH_COOKIE_NAME = AUTH_COOKIE_BASE_NAME;
