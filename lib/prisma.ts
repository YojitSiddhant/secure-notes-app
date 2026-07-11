import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { env } from "@/lib/env";

// Keep one Prisma Client instance per runtime so we do not open extra connections during development reloads.
declare global {
  // Store the cached client on the global object in development.
  var __prisma: PrismaClient | undefined;
}

// Create the Prisma Client only when we actually need it.
function createPrismaClient() {
  // Build the PostgreSQL adapter from the validated database URL.
  const adapter = new PrismaPg(env.DATABASE_URL);

  // Attach the adapter so Prisma 7 can talk to PostgreSQL.
  return new PrismaClient({ adapter });
}

// Reuse the cached client when it already exists.
export function getPrismaClient() {
  // Return the cached client if one was already created.
  if (globalThis.__prisma) {
    return globalThis.__prisma;
  }

  // Create a new client and cache it for later calls.
  const prisma = createPrismaClient();
  globalThis.__prisma = prisma;

  // Give the caller the ready-to-use client instance.
  return prisma;
}
