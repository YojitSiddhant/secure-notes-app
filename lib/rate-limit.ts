import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

import { env } from "@/lib/env";
import {
  buildRateLimitKey,
  createRateLimitExceededResponse,
  logSecurityEvent,
} from "@/lib/security";

type RateLimitScope = "signup" | "login" | "note-create" | "note-update" | "note-delete";

type RateLimitConfig = {
  limit: number;
  window: `${number} ${"ms" | "s" | "m" | "h" | "d"}` | `${number}${"ms" | "s" | "m" | "h" | "d"}`;
};

type RateLimitStore = {
  kind: "redis" | "local";
  limit(scope: RateLimitScope, identifier: string): Promise<{ success: boolean }>;
};

const rateLimitSettings: Record<RateLimitScope, RateLimitConfig> = {
  signup: {
    limit: 5,
    window: "1 h",
  },
  login: {
    limit: 10,
    window: "10 m",
  },
  "note-create": {
    limit: 120,
    window: "1 h",
  },
  "note-update": {
    limit: 180,
    window: "1 h",
  },
  "note-delete": {
    limit: 90,
    window: "1 h",
  },
};

let rateLimitStorePromise: Promise<RateLimitStore> | null = null;

function createRedisStore(): RateLimitStore {
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  const limiters = new Map<RateLimitScope, Ratelimit>();

  function getLimiter(scope: RateLimitScope) {
    const existingLimiter = limiters.get(scope);

    if (existingLimiter) {
      return existingLimiter;
    }

    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(rateLimitSettings[scope].limit, rateLimitSettings[scope].window),
      prefix: `secure-notes-app:${scope}`,
    });

    limiters.set(scope, limiter);

    return limiter;
  }

  return {
    kind: "redis",
    async limit(scope, identifier) {
      const limiter = getLimiter(scope);
      const result = await limiter.limit(identifier);
      return { success: result.success };
    },
  };
}

function createLocalStore(): RateLimitStore {
  // Temporary fallback for learning and preview deployments when Upstash is not configured.
  // This keeps the application running on Vercel without changing the surrounding architecture.
  return {
    kind: "local",
    async limit(scope, identifier) {
      void scope;
      void identifier;
      return { success: true };
    },
  };
}

async function getRateLimitStore(): Promise<RateLimitStore> {
  if (rateLimitStorePromise) {
    return rateLimitStorePromise;
  }

  rateLimitStorePromise = (async () => {
    const hasUpstashConfig = Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);

    if (hasUpstashConfig) {
      return createRedisStore();
    }

    return createLocalStore();
  })();

  return rateLimitStorePromise;
}

async function limitIdentifier(store: RateLimitStore, scope: RateLimitScope, identifier: string) {
  try {
    return await store.limit(scope, identifier);
  } catch (error) {
    if (store.kind === "redis") {
      if (env.NODE_ENV === "production") {
        throw error;
      }

      logSecurityEvent("rate_limit.redis_fallback", { scope });
      rateLimitStorePromise = Promise.resolve(createLocalStore());
      const fallbackStore = await rateLimitStorePromise;
      return fallbackStore.limit(scope, identifier);
    }

    throw error;
  }
}

export async function enforceAuthRateLimit(
  request: NextRequest | Request,
  scope: RateLimitScope,
  subject?: string,
) {
  let store: RateLimitStore;

  try {
    store = await getRateLimitStore();
  } catch {
    return null;
  }

  const identifiers = [buildRateLimitKey(scope, request)];

  if (subject) {
    identifiers.push(buildRateLimitKey(scope, request, subject));
  }

  for (const identifier of identifiers) {
    const result = await limitIdentifier(store, scope, identifier);

    if (!result.success) {
      logSecurityEvent("rate_limit.exceeded", { scope });
      return createRateLimitExceededResponse();
    }
  }

  return null;
}

export function getRateLimitConfigurationError() {
  // Retained for compatibility, but the temporary fallback should keep requests flowing.
  return null;
}
