# Code Campus KE

A mobile coding-learning app for Kenyan students aged 13–20, with guided web development lessons, streaks, progress tracking, and course completion certificates.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mobile` — Expo Router mobile app.
- `artifacts/mobile/data/courses.ts` — lesson content and quiz answers for all learning paths.
- `artifacts/mobile/context/LearningContext.tsx` — device-saved progress, streak, and certificate state.

## Architecture decisions

- The first version stores learning progress locally with AsyncStorage; it does not require an account or server.
- Certificates are digital recognitions for completing the app's learning paths, not external accreditation.

## Product

- Five beginner paths cover HTML, CSS, JavaScript, PHP, and MySQL.
- Short lessons include examples and quizzes; completing each path unlocks its certificate.
- Daily lesson activity builds streaks, with weekly and course progress summaries.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
