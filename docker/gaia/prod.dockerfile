# syntax=docker/dockerfile:1
# Commands are relative to the monorepo root
####################################
# Build gaia
####################################
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat openssl

# Setup environment
WORKDIR /usr/src
ENV NODE_ENV=production

# Copy deps metadata
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY .yarn .yarn
COPY .yarnrc.yml .yarnrc.yml
COPY apps/gaia/package.json apps/gaia/package.json

# Install deps
RUN yarn workspaces focus --production gaia

# Build gaia
COPY apps/gaia/ apps/gaia
COPY VERSION VERSION

RUN cd apps/gaia/ && yarn dlx prisma@5.2.0 generate
RUN --mount=type=secret,id=sentrysecret,dst=/usr/src/apps/gaia/.env yarn workspace gaia build

# Drop build-only caches so they don't end up in the final image
RUN rm -rf .yarn/cache apps/gaia/.next/cache

####################################
# Build the final image
####################################
# Only /usr/src is carried over, which leaves the yarn and prisma download
# caches (~120MB) in the builder stage.
FROM node:18-alpine
RUN apk add --no-cache libc6-compat openssl

WORKDIR /usr/src
ENV NODE_ENV=production
COPY --from=builder /usr/src /usr/src

# Run next directly instead of through `yarn workspace gaia start`, which keeps
# two yarn processes (~200MB RSS) alive next to the server.
WORKDIR /usr/src/apps/gaia
EXPOSE 3000
CMD ["node", "/usr/src/node_modules/next/dist/bin/next", "start"]
