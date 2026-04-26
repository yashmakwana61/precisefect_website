# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/scripts run seed` — seed CMS collections with initial site content

## Precisefect CMS

The Precisefect website ships with a self-contained mini-CMS for managing 6 content collections: `blog-posts`, `case-studies`, `faqs`, `team-members`, `job-openings`, `testimonials`.

- **Schema**: Drizzle tables in `lib/db/src/schema/`, validated via `drizzle-zod` (`zod/v4`).
- **API**: Generic CRUD factory in `artifacts/api-server/src/lib/crud.ts`, mounted by `routes/collections.ts`. Public `GET` returns only `isPublished:true` items; `?scope=admin` returns drafts when authenticated.
- **Auth**: HMAC-signed `psf_admin` cookie (7-day TTL). Secrets: `ADMIN_PASSWORD`, `SESSION_SECRET`. Routes in `routes/auth.ts`, middleware in `middlewares/authMiddleware.ts`.
- **Admin UI**: `/admin` (config-driven editor in `artifacts/precisefect/src/pages/admin/`). Field types: text, textarea, longtext, number, boolean, datetime, select, metrics. Bypasses public Layout via the location check in `App.tsx`.
- **Public pages** that read live data: `blog.tsx`, `case-studies.tsx`, `faq.tsx`, `careers.tsx` — all use React Query with `["public", "<collection>"]` keys.

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
