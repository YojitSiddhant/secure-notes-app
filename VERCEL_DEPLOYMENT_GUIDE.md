# Vercel Deployment Guide

## Current State

- Prisma Client generation is already wired into install/build:
  - `postinstall: prisma generate`
  - `build: prisma generate && next build`
- The app is already using Next.js route handlers with `runtime = "nodejs"` for API endpoints.
- Prisma is configured for PostgreSQL through `@prisma/adapter-pg`.
- The current local database target in `.env` is `localhost`, not a cloud PostgreSQL provider.

## Environment Variables

| Environment Variable Name | Description | Example Value | Required or Optional |
| --- | --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma Client generation and runtime database access. | `postgresql://USER:PASSWORD@HOST:5432/secure_notes_app?sslmode=require` | Required |
| `JWT_SECRET` | Secret used to sign and verify authentication JWTs and cookies. Must be at least 32 characters. | `b7f3f1b3f0e34d5e8f8c0f7c7c5f1d1d8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c` | Required |
| `NODE_ENV` | Controls production behavior such as secure cookies and strict origin handling. Vercel sets this automatically during production builds/runs. | `production` | Required, but platform-managed on Vercel |
| `APP_ORIGIN` | Canonical app origin used for trusted-origin checks. | `https://your-app.vercel.app` | Optional, strongly recommended for production |
| `TRUSTED_ORIGINS` | Comma-separated list of additional allowed origins for auth/state-changing requests. | `https://your-app.vercel.app,https://www.yourdomain.com` | Optional |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint for distributed rate limiting. | `https://us1-abc123.upstash.io` | Required for production operation |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token for distributed rate limiting. | `eyJhbGciOi...` | Required for production operation |

## What the Database Is Pointing To Now

The repository currently points to a local PostgreSQL instance:

- `DATABASE_URL="postgresql://siddhantyojit@localhost:5432/secure_notes_app?schema=public"`

So the current database is:

- `localhost`
- Not Neon
- Not Railway
- Not Supabase
- Not Vercel Postgres
- Not any other cloud provider in the checked files

## Production Database Migration Path

The project currently has no checked-in Prisma migrations directory, so the safest minimal production path is:

1. Create a cloud PostgreSQL database suitable for Vercel.
   - Good choices: Neon, Supabase, Railway, or Vercel Postgres.
2. Copy the provider’s production connection string into `DATABASE_URL`.
3. If you want to keep local data, export the local database and import it into the cloud database.
   - Example export:
     - `pg_dump "postgresql://siddhantyojit@localhost:5432/secure_notes_app?schema=public" > secure-notes-app.sql`
   - Example import:
     - `psql "postgresql://USER:PASSWORD@HOST:5432/secure_notes_app?sslmode=require" < secure-notes-app.sql`
4. Apply the schema to the cloud database.
   - Because this repo is currently schema-only, the minimal sync step is:
     - `npx prisma db push`
5. Regenerate Prisma Client.
   - `npx prisma generate`
6. Set the same production `DATABASE_URL` in Vercel.

## Vercel Environment Setup

Set these in the Vercel project settings:

- `DATABASE_URL`
- `JWT_SECRET`
- `APP_ORIGIN`
- `TRUSTED_ORIGINS` if you use more than one allowed origin
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Recommended scope:

- Production: definitely set all required production values
- Preview: set the same values or preview-specific equivalents if you want preview deployments to work end to end
- Development: keep local `.env` for local development only

## Deployment Checklist

- `npm install` completes successfully
- `npx prisma generate` succeeds
- `npm run lint` succeeds
- `npm run build` succeeds
- `DATABASE_URL` points to a cloud PostgreSQL instance, not `localhost`
- `JWT_SECRET` is set to a strong 32+ character secret
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set in production
- `APP_ORIGIN` matches the canonical production URL
- Any extra domains are listed in `TRUSTED_ORIGINS`
- The Prisma Client has been generated in the deployment pipeline

## Post-Deployment Verification

1. Open the deployed app and confirm the login and signup pages load.
2. Confirm authentication works:
   - sign up
   - log in
   - load the session endpoint
   - log out
3. Confirm notes CRUD works:
   - create a note
   - edit a note
   - delete a note
4. Confirm dashboard data loads from the cloud database.
5. Confirm production responses are not caching private data.
6. Confirm rate-limited routes behave correctly when requests are repeated.
7. Confirm the Vercel build logs show Prisma Client generation before the Next.js build.

## Backend Compatibility With Vercel Serverless Functions

The backend is compatible with Vercel Serverless Functions as currently written:

- API routes explicitly use `runtime = "nodejs"`.
- Prisma uses `@prisma/adapter-pg`, which is appropriate for PostgreSQL from Node runtime functions.
- The code uses standard `Request`/`Response` and `NextResponse` patterns.
- Auth, notes, and dashboard handlers do not depend on a custom server process.
- The proxy logic uses Next.js request utilities and JWT verification only.

Important compatibility notes:

- `bcrypt` requires Node runtime, which the API routes already declare.
- `fs/promises` is used only for local rate-limit fallback and is not relied on for production if Upstash is configured.
- Production rate limiting intentionally fails closed if Upstash variables are missing, so those environment variables are required for a working production deployment.

## Additional Vercel Configuration

No extra `vercel.json` is required from the inspected codebase.

What Vercel should use:

- Framework preset: Next.js
- Build command: `npm run build`
- Install command: default npm install is fine

The important part is that the environment variables are configured correctly and the production PostgreSQL database is reachable from Vercel.

## Remaining Production Issues To Watch

- If `DATABASE_URL` still points to localhost, Vercel deployment will not be able to reach the database.
- If `JWT_SECRET` is missing or too short, auth will fail.
- If Upstash variables are missing in production, auth and note mutations will return a configuration error because rate limiting fails closed.
- If `APP_ORIGIN` or `TRUSTED_ORIGINS` do not match the deployed URL(s), state-changing requests may be rejected as invalid origin requests.

