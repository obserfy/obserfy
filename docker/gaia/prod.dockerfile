FROM node:14.3.0

ENV NODE_ENV=production

COPY yarn.lock yarn.lock
COPY package.json package.json
COPY apps/gaia/package.json apps/gaia/package.json
RUN yarn install --production --frozen-lockfile

COPY apps/gaia apps/gaia
RUN yarn workspace gaia build

ENTRYPOINT ["yarn", "workspace", "gaia", "start"]
