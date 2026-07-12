import assert from "node:assert/strict";
import test from "node:test";

const testEnv = process.env as unknown as Record<string, string | undefined>;

testEnv.NODE_ENV = "test";
testEnv.DATABASE_URL = "postgresql://user:pass@localhost:5432/secure-notes-test";
testEnv.JWT_SECRET = "0123456789abcdef0123456789abcdef";
testEnv.APP_ORIGIN = "http://localhost:3000";
testEnv.TRUSTED_ORIGINS = "http://localhost:3000";

async function loadModules() {
  const auth = await import("../lib/auth.ts");
  const security = await import("../lib/security.ts");
  const noteValidation = await import("../lib/validations/note.ts");
  const authValidation = await import("../lib/validations/auth.ts");
  const noteService = await import("../services/note.service.ts");
  const signupRoute = await import("../app/api/auth/signup/route.ts");
  const logoutRoute = await import("../app/api/auth/logout/route.ts");
  const proxyModule = await import("../proxy.ts");
  const rateLimit = await import("../lib/rate-limit.ts");
  const noteIdRoute = await import("../app/api/notes/[id]/route.ts");

  return {
    auth,
    security,
    noteValidation,
    authValidation,
    noteService,
    signupRoute,
    logoutRoute,
    proxyModule,
    rateLimit,
    noteIdRoute,
  };
}

test("verifyAuthToken rejects malformed, forged, expired, wrong issuer, and wrong audience tokens", async () => {
  const { auth } = await loadModules();
  const { SignJWT } = await import("jose");

  const validToken = await auth.signAuthToken("user-1", "user@example.com");
  const validPayload = await auth.verifyAuthToken(validToken);
  assert.ok(validPayload);
  assert.equal(validPayload?.userId, "user-1");
  assert.equal(validPayload?.email, "user@example.com");

  const wrongIssuerToken = await new SignJWT({ userId: "user-1", email: "user@example.com" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject("user-1")
    .setIssuer("wrong-issuer")
    .setAudience("secure-notes-app-web")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(testEnv.JWT_SECRET));

  const wrongAudienceToken = await new SignJWT({ userId: "user-1", email: "user@example.com" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject("user-1")
    .setIssuer("secure-notes-app")
    .setAudience("wrong-audience")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(testEnv.JWT_SECRET));

  const expiredToken = await new SignJWT({ userId: "user-1", email: "user@example.com" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject("user-1")
    .setIssuer("secure-notes-app")
    .setAudience("secure-notes-app-web")
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) - 10)
    .sign(new TextEncoder().encode(testEnv.JWT_SECRET));

  const forgedToken = await new SignJWT({ userId: "user-1", email: "user@example.com" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject("user-1")
    .setIssuer("secure-notes-app")
    .setAudience("secure-notes-app-web")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode("different-secret-012345678901234567890123"));

  const forgedAlgToken = await new SignJWT({ userId: "user-1", email: "user@example.com" })
    .setProtectedHeader({ alg: "HS512", typ: "JWT" })
    .setSubject("user-1")
    .setIssuer("secure-notes-app")
    .setAudience("secure-notes-app-web")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(testEnv.JWT_SECRET));

  assert.equal(await auth.verifyAuthToken("not-a-jwt"), null);
  assert.equal(await auth.verifyAuthToken(wrongIssuerToken), null);
  assert.equal(await auth.verifyAuthToken(wrongAudienceToken), null);
  assert.equal(await auth.verifyAuthToken(expiredToken), null);
  assert.equal(await auth.verifyAuthToken(forgedToken), null);
  assert.equal(await auth.verifyAuthToken(forgedAlgToken), null);
});

test("origin validation rejects untrusted origins in production-style requests", async () => {
  const { security } = await loadModules();
  const response = security.enforceTrustedOrigin(
    new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        origin: "https://evil.example",
      },
    }),
  );

  assert.ok(response);
  assert.equal(response?.status, 403);
});

test("safe redirect helper blocks open redirects", async () => {
  const { security } = await loadModules();
  assert.equal(security.getSafeInternalRedirectPath("/dashboard?create=1"), "/dashboard?create=1");
  assert.equal(security.getSafeInternalRedirectPath("https://evil.example"), "/dashboard");
  assert.equal(security.getSafeInternalRedirectPath("//evil.example"), "/dashboard");
});

test("security headers include the production CSP and transport hardening", async () => {
  const previousNodeEnv = testEnv.NODE_ENV;
  testEnv.NODE_ENV = "production";

  const { buildSecurityHeaders } = await import("../next.config.ts");
  const headers = buildSecurityHeaders();

  testEnv.NODE_ENV = previousNodeEnv;

  const headerMap = new Map(headers.map((header) => [header.key, header.value]));
  assert.equal(headerMap.get("Strict-Transport-Security"), "max-age=63072000; includeSubDomains; preload");
  assert.ok(String(headerMap.get("Content-Security-Policy")).includes("frame-ancestors 'none'"));
  assert.ok(String(headerMap.get("Content-Security-Policy")).includes("default-src 'self'"));
  assert.equal(headerMap.get("Cross-Origin-Opener-Policy"), "same-origin");
  assert.equal(headerMap.get("Cross-Origin-Resource-Policy"), "same-origin");
});

test("invalid UUID note ids are rejected by the route schema", async () => {
  const { noteIdRoute } = await loadModules();
  assert.equal(noteIdRoute.noteIdSchema.safeParse("not-a-uuid").success, false);
});

test("note schemas reject oversize values and unknown fields", async () => {
  const { noteValidation, authValidation } = await loadModules();

  assert.equal(
    noteValidation.createNoteSchema.safeParse({
      title: "a".repeat(201),
      description: "Valid description",
      priority: "HIGH",
    }).success,
    false,
  );

  assert.equal(
    noteValidation.createNoteSchema.safeParse({
      title: "Valid title",
      description: "a".repeat(5001),
      priority: "HIGH",
    }).success,
    false,
  );

  assert.equal(noteValidation.listNotesQuerySchema.safeParse({ search: "a".repeat(201) }).success, false);

  assert.equal(
    authValidation.signUpSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "0123456789ab",
      unexpected: "field",
    }).success,
    false,
  );
});

test("duplicate email detection maps Prisma unique constraint errors", async () => {
  const { signupRoute } = await loadModules();

  assert.equal(signupRoute.isPrismaUniqueConstraintError({ code: "P2002" }), true);
  assert.equal(signupRoute.isPrismaUniqueConstraintError({ code: "P2003" }), false);
});

test("rate limiting falls back to a no-op store when Upstash config is missing", async () => {
  const { rateLimit } = await loadModules();

  const request = new Request("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: {
      origin: "http://localhost:3000",
      "x-forwarded-for": "203.0.113.10",
    },
  });

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const result = await rateLimit.enforceAuthRateLimit(request, "signup", "brute-force@example.com");
    assert.equal(result, null);
  }
});

test("logout clears the same cookie name with an immediate expiry", async () => {
  const { logoutRoute } = await loadModules();

  const response = await logoutRoute.POST(
    new Request("http://localhost:3000/api/auth/logout", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
      },
    }),
  );

  const setCookie = response.headers.get("set-cookie") ?? "";
  assert.equal(response.status, 200);
  assert.ok(setCookie.includes("auth_token="));
  assert.ok(setCookie.toLowerCase().includes("max-age=0"));
  assert.ok(setCookie.toLowerCase().includes("httponly"));
});

test("proxy redirects unauthenticated users to login and preserves only safe next paths", async () => {
  const { proxyModule, auth } = await loadModules();

  const unauthenticatedRequest = {
    url: "http://localhost:3000/dashboard",
    nextUrl: new URL("http://localhost:3000/dashboard"),
    headers: new Headers(),
    cookies: {
      get: () => undefined,
    },
  };

  const redirected = await proxyModule.proxy(unauthenticatedRequest as never);
  assert.equal(redirected.status, 307);
  assert.ok((redirected.headers.get("location") ?? "").includes("/login?next=%2Fdashboard"));

  const token = await auth.signAuthToken("user-1", "user@example.com");
  const authenticatedRequest = {
    url: "http://localhost:3000/login",
    nextUrl: new URL("http://localhost:3000/login"),
    headers: new Headers(),
    cookies: {
      get: () => ({ value: token }),
    },
  };

  const redirectedAuthenticated = await proxyModule.proxy(authenticatedRequest as never);
  assert.equal(redirectedAuthenticated.status, 307);
  assert.equal(redirectedAuthenticated.headers.get("location"), "http://localhost:3000/dashboard");
});

test("note service scopes ownership and omits sensitive fields from responses", async () => {
  const { noteService } = await loadModules();

  const fakeDb = {
    note: {
      create: async ({
        data,
      }: {
        data: {
          title: string;
          description: string;
          priority: "HIGH" | "MEDIUM" | "LOW";
        };
      }) => ({
        id: "note-1",
        title: data.title,
        description: data.description,
        priority: data.priority,
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
        updatedAt: new Date("2025-01-01T00:00:00.000Z"),
      }),
      findMany: async () => [],
      updateMany: async () => ({ count: 1 }),
      deleteMany: async () => ({ count: 1 }),
      findUnique: async () => ({
        id: "note-1",
        title: "Safe title",
        description: "Safe description",
        priority: "HIGH",
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
        updatedAt: new Date("2025-01-01T00:00:00.000Z"),
      }),
      count: async () => 0,
    },
  };

  const created = await noteService.createNote(
    "user-a",
    {
      title: "Hello",
      description: "World",
      priority: "HIGH",
    },
    fakeDb as never,
  );

  assert.deepEqual(Object.keys(created).sort(), ["createdAt", "description", "id", "priority", "title", "updatedAt"]);

  const updated = await noteService.updateNote(
    "user-a",
    "note-1",
    {
      title: "Updated",
      description: "Updated",
      priority: "LOW",
    },
    fakeDb as never,
  );

  assert.equal(updated.title, "Safe title");
  assert.deepEqual(Object.keys(updated).sort(), ["createdAt", "description", "id", "priority", "title", "updatedAt"]);

  await assert.rejects(
    noteService.updateNote(
      "user-a",
      "note-2",
      {
        title: "Updated",
        description: "Updated",
        priority: "LOW",
      },
      ({
        note: {
          ...fakeDb.note,
          updateMany: async () => ({ count: 0 }),
          findUnique: async () => ({ userId: "user-b" }),
        },
      } as never),
    ),
    (error: unknown) => error instanceof noteService.NoteForbiddenError,
  );

  await assert.rejects(
    noteService.deleteNote("user-a", "note-3", ({
      note: {
        ...fakeDb.note,
        deleteMany: async () => ({ count: 0 }),
        findUnique: async () => null,
      },
    } as never)),
    (error: unknown) => error instanceof noteService.NoteNotFoundError,
  );
});

test("app routes and helpers reject malformed auth inputs safely", async () => {
  const { auth } = await loadModules();

  assert.equal(await auth.getAuthenticatedUserFromToken(null), null);
  assert.equal(await auth.getAuthenticatedUserFromToken("bad.token.value"), null);
});
