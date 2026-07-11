import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required."),
  JWT_SECRET: z.string().trim().min(32, "JWT_SECRET must be at least 32 characters."),
  NODE_ENV: z.enum(["development", "test", "production"]),
  APP_ORIGIN: z.string().url().optional(),
  TRUSTED_ORIGINS: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;
let cachedError: Error | null = null;

function readProcessEnv() {
  return {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    APP_ORIGIN: process.env.APP_ORIGIN,
    TRUSTED_ORIGINS: process.env.TRUSTED_ORIGINS,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  };
}

function validateEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  if (cachedError) {
    throw cachedError;
  }

  const parsedEnv = envSchema.safeParse(readProcessEnv());

  if (!parsedEnv.success) {
    const issues = parsedEnv.error.issues
      .map((issue) => {
        const key = issue.path.join(".") || "environment variable";
        return `${key}: ${issue.message}`;
      })
      .join("\n");

    cachedError = new Error(`Invalid environment variables:\n${issues}`);
    throw cachedError;
  }

  cachedEnv = parsedEnv.data;
  return cachedEnv;
}

export function getEnv(): Env {
  return validateEnv();
}

export const env = new Proxy({} as Env, {
  get(_target, prop) {
    const value = validateEnv()[prop as keyof Env];
    return value;
  },
}) as Env;
