FROM node:15

# Setup environment
WORKDIR /usr/src
ENV NODE_ENV=production

# Copy deps metadata
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY .yarn .yarn
COPY .pnp.js .pnp.js
COPY .yarnrc.yml .yarnrc.yml
COPY apps/gaia/package.json apps/gaia/package.json

# Install deps
RUN yarn workspaces focus gaia

# Build gaia
COPY apps/gaia/ apps/gaia
COPY VERSION VERSION
RUN yarn workspace gaia build

ENTRYPOINT ["yarn", "workspace", "gaia", "start"]
