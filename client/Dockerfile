FROM node:10-alpine AS builder
WORKDIR /usr/app

RUN apk add --no-cache bash git openssh util-linux
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build:prod
RUN yarn build:ssr

FROM node:10-alpine
ENV NODE_ENV=production

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY package.json yarn.lock ./
RUN apk add --no-cache tini bash git && \
  yarn install --frozen-lockfile --production && \
  apk del bash git

USER node
COPY --from=builder --chown=node:node /usr/app/dist/client ./public
COPY --from=builder --chown=node:node /usr/app/dist/ssr ./build
RUN ls -lah

ARG VCS_REF
LABEL org.label-schema.vcs-ref=$VCS_REF \
  org.label-schema.vcs-url="https://github.com/lolPants/beatsaver-reloaded"

ENTRYPOINT ["/sbin/tini", "--"]
EXPOSE 1234
CMD ["node", "."]
