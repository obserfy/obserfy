# syntax = docker/dockerfile:1.0-experimental
FROM node:18-alpine
RUN apk add --no-cache libc6-compat

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

RUN cd apps/gaia/ && yarn dlx prisma generate
RUN --mount=type=secret,id=sentrysecret,dst=/usr/src/apps/gaia/.env yarn workspace gaia build

ENTRYPOINT ["yarn", "workspace", "gaia", "start"]
