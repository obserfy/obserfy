# AGENTS.md

Guidance for coding agents (and humans) working in this repo. Keep it short and true: if you
change a command, script, or workflow mentioned here, update this file in the same PR.
`CLAUDE.md` files next to each `AGENTS.md` just import it, so edit `AGENTS.md` only.

Obserfy is a record-keeping tool for Montessori schools. This is a legacy monorepo in
**maintenance mode**: most work is bug fixes, dependency/security bumps, and keeping CI and
deploys alive. Prefer small, surgical changes over refactors or framework upgrades.

## Repo map

| Path | What it is | Stack |
| --- | --- | --- |
| `apps/vor/pkg` | Teacher app backend (REST API, also serves the built frontend) | Go 1.19 module `github.com/chrsep/vor`, chi, go-pg, zap |
| `apps/vor/frontend` | Teacher app SPA (workspace name `vor`) | Gatsby 4, React, TypeScript, theme-ui + Tailwind, react-query, Lingui |
| `apps/gaia` | Parent portal (workspace name `gaia`) | Next.js 12, Prisma 5, Auth0, Tailwind |
| `docker/` | Dockerfiles: `vor/prod.dockerfile`, `gaia/prod.dockerfile`, dev nginx/postgres | |
| `docker-compose.yml` | Dev stack: vor app (live reload), nginx (https :8000), postgres, minio, imgproxy | |
| `.github/workflows/` | CI (`build-and-test`, `static-analysis`), `release`, `deploy` | |

See `apps/vor/AGENTS.md` and `apps/gaia/AGENTS.md` for app-specific rules.

Related repos (not in this checkout): `obserfy/freyr` (marketing site) and `chrsep/vor-infra`
(Terraform for DigitalOcean; pins the `obserfy/vor` and `obserfy/gaia` image versions that run in prod).

## Toolchain

- Yarn 3 (Berry) workspaces, vendored at `.yarn/releases/yarn-3.2.2.cjs`, `nodeLinker: node-modules`.
  Always run `yarn` from the repo root; target a package with `yarn workspace <vor|gaia> <script>`.
  Never use npm, and never commit a `package-lock.json`.
- Node: `.nvmrc` says 16 (vor frontend build/CI). gaia CI and static analysis use Node 18.
  Newer Node versions can install deps and run typecheck/lint, but Gatsby 4 builds are only known
  to work on 16.
- Go: `go.mod` targets 1.19 (matches `golang:1.19` in the prod Dockerfile and CI). Newer Go
  toolchains build it fine; don't bump the `go` directive unless asked.

## Commands

Run from the repo root unless noted.

```sh
yarn install                            # all JS deps (~3 min cold); husky post-checkout also runs it

# Static checks, same as .github/workflows/static-analysis.yml
yarn workspace gaia prisma generate     # required before gaia typecheck/lint
yarn workspaces foreach -p run typecheck
yarn workspaces foreach -p run lint

# Go backend (from apps/vor)
go build ./...
go test ./pkg/<package>/...             # needs Postgres + S3, see apps/vor/AGENTS.md
gofmt -w -s <files>

# Builds
yarn workspace vor run i18n:compile     # needed once before vor lint/typecheck/build:ci
yarn workspace vor run build:ci         # Gatsby production build (Node 16)
yarn workspace gaia run build           # Next.js production build
```

Lint currently passes with many warnings (mostly Tailwind class migration hints). Don't
"fix" unrelated warnings in a PR; only keep the files you touch from getting worse.

## Code style

- Prettier 2.5 for JS/TS (no semicolons, double quotes, 2 spaces, `trailingComma: es5`);
  `gofmt -s` for Go. The husky `pre-commit` hook runs both through lint-staged on staged files.
- Import `dayjs` only from the local wrapper (`apps/vor/frontend/src/dayjs.ts`, `$lib/dayjs` in
  gaia). ESLint enforces this.
- Follow the patterns already in the file you're editing; the codebase has older and newer
  styles side by side (see the app AGENTS.md files for which one to prefer).

## Database

- One Postgres database (`defaultdb`) is shared by both apps. **vor owns the schema**: tables
  are defined as go-pg structs in `apps/vor/pkg/postgres/*.go` and created on startup by
  `postgres.InitTables` (`CREATE TABLE IF NOT EXISTS`). That never alters existing tables.
- Any change to an existing table needs a hand-written SQL migration in `apps/vor/migrations/`
  that is applied manually to prod. Call it out in the PR description.
- gaia reads the same tables through Prisma. If you change the schema, update
  `apps/gaia/prisma/schema.prisma` to match and run `yarn workspace gaia prisma generate`.

## Git, CI and releases

- `master` is the live branch. `develop` is stale; don't base work on it or target PRs at it.
- Commit messages use Conventional Commits (`fix(vor): ...`, `feat(gaia): ...`, `chore(deps): ...`,
  `ci: ...`). `standard-version` builds `CHANGELOG.md` and the version from them.
- CI (`build-and-test.yml`, `static-analysis.yml`) runs on pushes to every branch except `master`:
  vor frontend build, gaia build, Go tests against Postgres + MinIO service containers, typecheck,
  lint, and Cypress e2e on the docker-compose stack.
- Releasing is automatic: a merge to `master` runs `release.yml` (bumps `VERSION`, updates
  `CHANGELOG.md`, tags `vX.Y.Z`), and the tag triggers `deploy.yml`, which builds and pushes the
  `obserfy/vor` and `obserfy/gaia` Docker images. Production picks up a version only when
  `chrsep/vor-infra` is updated to that tag.

## Boundaries

- Never edit by hand: `CHANGELOG.md`, `VERSION` (release bot), `yarn.lock` (only via `yarn`),
  `apps/vor/frontend/src/__generated__/*` (frozen Gatsby typegen output, plus `models.ts` from
  `yarn workspace vor run gen:models`),
  `apps/vor/frontend/i18n/lingui/id/messages.po` (translations come from Crowdin).
- Never commit secrets. Real keys go in `.env.local` (repo root, for vor/docker-compose) or
  `apps/gaia/.env.local`, both gitignored. The values in the committed `.env` files are
  dev-only defaults.
- Ask before: changing `.github/workflows/*` release/deploy steps, adding a dependency, bumping a
  framework major (Gatsby, Next, React, go-pg, Prisma), or anything that changes the DB schema.
- Renovate opens and automerges dependency PRs; don't hand-bump versions it already manages
  unless fixing a security issue or a broken build.
