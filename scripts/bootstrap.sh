#!/usr/bin/env bash
# One-shot local setup: checks prerequisites, installs JS deps, generates the files the apps need,
# and starts the docker-compose dev stack. Safe to re-run.
#
#   ./scripts/bootstrap.sh
#
# Set DOCKER_REGISTRY_MIRROR=docker.io to pull images from Docker Hub instead of mirror.gcr.io.
set -euo pipefail

cd "$(dirname "$0")/.."

info() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33mwarning:\033[0m %s\n' "$*" >&2; }
fail() {
  printf '\033[1;31merror:\033[0m %s\n' "$*" >&2
  exit 1
}

# version_ge A B: true when version A >= version B (numeric, dot separated).
version_ge() {
  [ "$(printf '%s\n%s\n' "$2" "$1" | sort -t. -k1,1n -k2,2n -k3,3n | head -n1)" = "$2" ]
}

info "Checking prerequisites"

command -v docker >/dev/null || fail "Docker is not installed: https://docs.docker.com/get-docker/"
docker info >/dev/null 2>&1 || fail "Docker is installed but the daemon isn't running (or you can't access it). Start Docker and re-run."
compose_version="$(docker compose version --short 2>/dev/null | sed 's/^v//')" ||
  fail "Docker Compose v2 is required ('docker compose', not 'docker-compose')."
version_ge "$compose_version" "2.24.0" ||
  fail "Docker Compose $compose_version is too old, 2.24.0 or newer is required. Update Docker Desktop / the compose plugin."

command -v node >/dev/null || fail "Node.js is not installed. Install Node 16 or newer (see .nvmrc)."
node_major="$(node -p 'process.versions.node.split(".")[0]')"
[ "$node_major" -ge 16 ] || fail "Node $(node -v) is too old, Node 16 or newer is required (see .nvmrc)."

if command -v yarn >/dev/null; then
  yarn=(yarn)
elif command -v corepack >/dev/null; then
  yarn=(corepack yarn)
else
  fail "Yarn is not installed. Run 'corepack enable' (ships with Node 16.9+) or install Yarn."
fi

# Real secrets (Mux, Mailgun, Paddle) go in .env.local, which is gitignored. Optional, but handy to have.
if [ ! -f .env.local ]; then
  info "Creating an empty .env.local for your local secrets"
  touch .env.local
fi

info "Installing JS dependencies (a few minutes on a cold cache)"
"${yarn[@]}" install

info "Generating translations (vor) and the Prisma client (gaia)"
"${yarn[@]}" workspace vor run i18n:compile
"${yarn[@]}" workspace gaia prisma generate

info "Starting the docker-compose stack"
docker compose up -d --build

info "Waiting for the API at https://localhost:8000 (the first start downloads Go modules)"
for _ in $(seq 1 120); do
  if curl -fsk -o /dev/null https://localhost:8000/ping; then
    api_up=1
    break
  fi
  sleep 3
done
if [ -z "${api_up:-}" ]; then
  warn "The API didn't come up in time. Check 'docker compose logs vor_app'."
  exit 1
fi

cat <<'EOF'

Obserfy is running.

  Teacher app (vor):  yarn workspace vor run develop   ->  http://localhost:8001
                      API behind nginx at https://localhost:8000 (self-signed cert)
  Parent app (gaia):  yarn workspace gaia dev          ->  http://localhost:3000
                      needs Auth0 keys in apps/gaia/.env.local
  Go tests:           cd apps/vor && go test ./...
  Stop the stack:     docker compose down

Video (Mux), email (Mailgun) and billing (Paddle) only work with real keys in .env.local.
EOF
