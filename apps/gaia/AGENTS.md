# gaia (parent portal)

Read the root `AGENTS.md` first. gaia is a Next.js 12 app (pages router) where guardians view
their children's observations, lesson plans, media and progress reports. It has no schema of its
own: it reads and writes the tables owned by vor's Go backend.

## Layout

- `src/pages/[studentId]/**`: SSR pages, wrapped in `withAuthorization` from `src/lib/auth.ts`
  (Auth0 login + checks the logged-in guardian is linked to that student).
- `src/pages/api/**`: API routes, wrapped in `protectedApiRoute` / `apiRoute` from
  `src/utils/rest.ts` (Auth0 session check, error logging, Sentry).
- `src/lib/*`: data access through Prisma (`src/lib/prisma.ts`, queries in `src/lib/db.ts`,
  `images.ts`, `video.ts`, ...). `src/db/pg.ts` and `src/db/queries.ts` are the older raw `pg`
  layer, marked deprecated; write new queries with Prisma in `src/lib`.
- `src/hooks/api/*`: react-query (`@tanstack/react-query` v4) hooks for client-side fetching.
- Path aliases (`tsconfig.json`): `$components/*`, `$layouts/*`, `$lib/*`, `$hooks/*`, ...
  Prefer them over long relative imports in new code.
- Styling: Tailwind (with forms/typography/aspect-ratio plugins) and Headless UI.

## Rules

- **Authorization:** `protectedApiRoute` only proves the user is logged in. Any route that takes a
  `childId`, `planId`, `observationId`, `imageId`, etc. must also confirm the session user's email
  belongs to a guardian linked to that student (see `findStudentAndGuardianById` /
  `findRelatedStudents` in `src/lib/db.ts`) before reading or writing.
- Images are served through imgproxy URLs (`src/utils/imgproxy.ts`), never raw MinIO URLs.
- The Prisma schema mirrors vor's go-pg models. Don't use `prisma migrate` or `db push`; schema
  changes start in `apps/vor/pkg/postgres` plus a SQL file in `apps/vor/migrations/`, then update
  `prisma/schema.prisma` to match and regenerate the client.

## Commands

From the repo root:

```sh
yarn workspace gaia prisma generate   # after install and after any schema.prisma change
yarn workspace gaia typecheck
yarn workspace gaia lint              # passes with warnings
yarn workspace gaia run dev           # http://localhost:3000
yarn workspace gaia run build         # what CI runs (Node 18)
```

`yarn workspace gaia test` is currently broken (Jest has no TypeScript transform configured, and
it isn't run in CI), so don't use it as a signal unless you're fixing it.

Running `dev` needs the vor Postgres/MinIO/imgproxy stack (root `docker compose up -d`) and real
Auth0 credentials (`AUTH0_ISSUER_BASE_URL`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`) in
`apps/gaia/.env.local`. Defaults for everything else are in the committed `apps/gaia/.env`.
