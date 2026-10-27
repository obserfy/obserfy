# vor (teacher app)

Read the root `AGENTS.md` first. vor is two parts: a Go API in `pkg/` and a Gatsby SPA in
`frontend/`. In production the Go binary serves both (`/api/v1`, `/auth`, `/webhooks/v1`, and the
static Gatsby build from `./frontend/public`) on port 8080.

## Backend (`pkg/`)

Layout: one package per resource (`student`, `school`, `class`, `curriculum`, `lessonplan`,
`observation`, `progress_report`, `videos`, ...). Each has a `NewRouter(server, store)` that
`pkg/main.go` mounts under `/api/v1`. Persistence lives in `pkg/postgres/*_store.go` (go-pg).
Infra adapters: `minio` (S3 images/files), `mux` (video), `mailgun` (email), `paddle` (billing
webhooks), `imgproxy` (signed image URLs).

Conventions:

- Handlers: new code should use `s.NewHandler2(func(r *rest.Request) rest.ServerResponse)`
  (see `pkg/progress_report`). `s.NewHandler` returning `*rest.Error` is the older, deprecated
  style; it's fine to keep using it when editing a package that is written that way.
- Return 5xx via `&rest.Error{Code: http.StatusInternalServerError, ...}` or
  `s.InternalServerError(err)`: they log
  and send to Sentry and hide the message from the client. 4xx messages are shown to users.
- Wrap errors with `richErrors "github.com/pkg/errors"` (`richErrors.Wrap(err, "...")`).
- **Multi-tenancy:** every resource router uses an `authorizationMiddleware` that checks the
  session user belongs to the school that owns the resource. New routes must sit behind it.
  Never trust IDs from the request body without the same check.
- Models: go-pg structs in `pkg/postgres` are the DB schema (see root AGENTS.md → Database).
  Many-to-many join models must be registered in the `init()` in `pkg/postgres/postgres.go`
  and listed in `InitTables`.
- JSON API types shared with the frontend: `pkg/domain`. After changing a struct that
  `tscriptify/main.go` converts, run `yarn workspace vor run gen:models` to regenerate
  `frontend/src/__generated__/models.ts`.

### Tests

Tests live in `pkg/<resource>/test/` as testify suites embedding `testutils.BaseTestSuite`, which
provides fixtures (`GenerateSchool`, `GenerateStudent`, ...) and request helpers (`ApiTest`,
`CreateRequest`). They hit a real database, so add a test there for any handler change.

They need, on localhost:

- Postgres on `:5432`, user/password `postgres`/`postgres`, with a `defaultdb_test` database.
  Tables are created on first run.
- S3/MinIO on `:9000` with the keys from the root `.env`. `school` and `student` tests read
  objects back, so they need a real MinIO; the other packages only need a bucket check to pass.
- Env: `testutils` loads `.env.test`, `.env.local`, `.env` from the repo root and stops at the
  first missing file. **Create an empty `.env.local` at the repo root** or `MINIO_*` is never set
  and tests hang retrying the S3 connection.

```sh
docker compose up -d db minio     # or native postgres/minio, see below
touch ../../.env.local
go test ./...                     # from apps/vor; CI uses gotestsum, same packages
go test ./pkg/class/...           # single package
```

Both `postgres.Connect` and `minio.NewClient` retry forever instead of failing, so a test that
hangs printing "PostgreSQL is down" or "Can't connect to minio/s3" means a dependency isn't
reachable. Run with a timeout.

### Running the API locally

`docker compose up -d` starts the full stack (API with live reload and delve on :40000, nginx
https on :8000, postgres, minio, imgproxy). If Docker Hub pulls are rate-limited, run natively:
start Postgres (SSL on, `defaultdb` created), something S3-compatible on :9000, then from
`apps/vor` run `go build -o app ./pkg && ./app` with the root `.env` loaded and
`DB_HOST=localhost MINIO_ENDPOINT=localhost:9000`. The API listens on :8080.

Video (Mux), email (Mailgun) and billing (Paddle) need real keys in the root `.env.local`; they
can't be exercised without them.

## Frontend (`frontend/`, workspace `vor`)

- Gatsby 4 SPA; `/dashboard/*` requires a session (enforced by the Go server in
  `pkg/frontend.go`, and API 401s redirect to `/login`). Pages in
  `src/pages`, components in `src/components/<Name>/<Name>.tsx` with a `.stories.tsx` and
  `.test.tsx` next to them (`yarn workspace vor run gen:component <Name>` scaffolds this).
- Styling: theme-ui is the main system (`jsxImportSource: "theme-ui"`, `sx` props, theme in
  `src/gatsby-plugin-theme-ui`). Tailwind exists but is used in only a few files; match whatever
  the surrounding component uses.
- Data fetching: react-query hooks in `src/hooks/api/**` built on `fetchApi.ts`/`useApi.ts`.
  Add new endpoints as hooks there, not as ad-hoc `fetch` calls in components.
- Navigation: import `Link`/`navigate` from `src/components/Link/Link`, not from `gatsby`,
  so the locale prefix is kept.
- i18n: user-facing strings go through Lingui (`t`/`Trans` from `@lingui/macro`). After adding
  strings, run `yarn workspace vor run i18n:extract` and commit the updated
  `i18n/lingui/en/messages.po`. Other locales come from Crowdin.
- `src/__generated__/gatsby-types.ts` and `gatsby-schema.graphql` are frozen output from a
  disabled typegen plugin. Leave them alone.

Commands (from the repo root):

```sh
yarn workspace vor run i18n:compile   # once, before typecheck/lint/build
yarn workspace vor typecheck
yarn workspace vor lint
yarn workspace vor run develop        # dev server on :8001, proxies /api,/auth to https://localhost:8000
yarn workspace vor run build:ci       # production build (Node 16)
```

Jest/snapshot tests (`yarn workspace vor test`) are disabled in CI since the Gatsby 4 upgrade and
need a prior Gatsby build. Don't rely on them as a signal. Cypress e2e
(`cypress/e2e`, `yarn workspace vor run cy:run`) runs in CI against the docker-compose stack at
`https://localhost:8000`.
