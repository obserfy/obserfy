<p align="center">
    <img width="76px" src="./apps/vor/frontend/src/images/logo-standalone.svg" alt="Obserfy logo" />
</p>

<h1 align="center">
  Obserfy
</h1>

<p align="center">
    Montessori record keeping software and parent communication tool.
</p>

<p align="center">
  <a href="https://codecov.io/gh/obserfy/obserfy">
    <img src="https://codecov.io/gh/obserfy/obserfy/branch/develop/graph/badge.svg" alt="Code Coverage" />
  </a>

  <a href="https://github.com/obserfy/obserfy/actions/workflows/build-and-test.yml">
    <img src="https://github.com/obserfy/obserfy/actions/workflows/build-and-test.yml/badge.svg" />
  </a>
</p>

This is the monorepo of [Obserfy](https://obserfy.com). This repo contains every code that you need to run Obserfy on
your own. Obserfy is currently still on its early days. If you were to give it a try, we would love to hear any of your
feedback through GitHub issue, email at [support@obserfy.com](mailto:support@obserfy.com), or [canny](https://feedback.obserfy.com). 

## Running locally

You need Docker (with Compose 2.24+), Node 16 or newer, and Yarn (`corepack enable` gives you the right version).
Go 1.19+ is only needed to run the backend tests outside Docker.

```sh
./scripts/bootstrap.sh              # installs deps, generates files, starts the docker-compose stack
yarn workspace vor run develop      # teacher app on http://localhost:8001
```

The bootstrap script is safe to re-run. It starts Postgres, MinIO, imgproxy, the Go API (live reload, delve on
`:40000`) and nginx serving the API on `https://localhost:8000`. Docker images are pinned and pulled through
`mirror.gcr.io` so Docker Hub rate limits don't get in the way; set `DOCKER_REGISTRY_MIRROR=docker.io` to pull
from Docker Hub directly.

Secrets for Mux (video), Mailgun (email) and Paddle (billing) go in `.env.local` at the repo root; those
features don't work without them. The parent app (`yarn workspace gaia dev`) needs Auth0 keys in
`apps/gaia/.env.local`.

### Troubleshooting

- **MinIO won't start:** a `vor-minio` volume left over from the old `minio/minio:latest` image may not be
  readable by the pinned image. If you don't need the uploaded files, run `docker compose down`, remove the
  volume (`docker volume ls | grep vor-minio`, then `docker volume rm <name>`), and start again.
- **Gatsby: `error:0308010C:digital envelope routines::unsupported`:** start the dev server with
  `yarn workspace vor run develop`, which sets the OpenSSL flag Node 17+ needs. Run `gatsby` directly
  only with `NODE_OPTIONS=--openssl-legacy-provider`.
- **Blank teacher app page / `Cannot find module './en/messages'`:** translations aren't compiled. Run
  `yarn workspace vor run i18n:compile` (the `develop` script does this for you).

## Codebase

### Folder structure

```sh
packages/*        # Contains various patched or custom libraries that we use
docker/*          # Contains dockerfile  for every projects. 
apps/
|--freyr          # Our landing page powered by gatsby
|--gaia           # Contains all api and frontend for our parent's dashboard, powered by nextjs
|--vor            # Contains all code for teacher's dashboard, powered by gatsby and go
```

See each folder's README.md files for more info about them.
