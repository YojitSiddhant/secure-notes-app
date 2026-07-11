import { createHash } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import os from "os";
import path from "path";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

import { env } from "@/lib/env";
import {
  buildRateLimitKey,
  createConfigurationErrorResponse,
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

type StoredEntry = {
  timestamps: number[];
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

const localStorePath = path.join(os.tmpdir(), "secure-notes-app", "rate-limit.json");

let rateLimitStorePromise: Promise<RateLimitStore> | null = null;

function hashKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

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

async function loadLocalEntries(): Promise<Record<string, StoredEntry>> {
  try {
    const raw = await readFile(localStorePath, "utf8");
    return JSON.parse(raw) as Record<string, StoredEntry>;
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "ENOENT") {
      return {};
    }

    throw error;
  }
}

async function saveLocalEntries(entries: Record<string, StoredEntry>) {
  await mkdir(path.dirname(localStorePath), { recursive: true });
  await writeFile(localStorePath, JSON.stringify(entries), "utf8");
}

function createLocalStore(): RateLimitStore {
  return {
    kind: "local",
    async limit(scope, identifier) {
      const hashedKey = hashKey(`${scope}:${identifier}`);
      const store = await loadLocalEntries();
      const entry = store[hashedKey] ?? { timestamps: [] };
      const now = Date.now();
      const windowMs = parseWindow(rateLimitSettings[scope].window);
      const freshTimestamps = entry.timestamps.filter((timestamp) => now - timestamp < windowMs);

      if (freshTimestamps.length >= rateLimitSettings[scope].limit) {
        store[hashedKey] = {
          timestamps: freshTimestamps,
        };
        await saveLocalEntries(store);
        return { success: false };
      }

      freshTimestamps.push(now);
      store[hashedKey] = {
        timestamps: freshTimestamps,
      };
      await saveLocalEntries(store);

      return { success: true };
    },
  };
}

function parseWindow(window: string) {
  const trimmedWindow = window.trim();
  const match = /^(\d+)\s*(ms|s|m|h|d)$/.exec(trimmedWindow);

  if (!match) {
    throw new Error(`Unsupported rate limit window: ${window}`);
  }

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return amount;
    case "s":
      return amount * 1000;
    case "m":
      return amount * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    case "d":
      return amount * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Unsupported rate limit window: ${window}`);
  }
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

    if (env.NODE_ENV === "production") {
      throw new Error("Rate limiting is not configured for production.");
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
    return createConfigurationErrorResponse("Server rate limiting is not configured.");
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
  return createConfigurationErrorResponse("Server rate limiting is not configured.");
}
