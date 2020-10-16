FROM node:14.3.0

ENV NODE_ENV=production

ARG NEXT_PUBLIC_GAIA_SEGMENT_KEY

COPY package.json package.json
COPY yarn.lock yarn.lock
COPY .yarn .yarn
COPY .pnp.js .pnp.js
COPY .yarnrc.yml .yarnrc.yml
COPY apps/gaia/package.json apps/gaia/package.json
RUN yarn install

COPY apps/gaia/ apps/gaia
RUN yarn workspace gaia build

ENTRYPOINT ["yarn", "workspace", "gaia", "start"]
