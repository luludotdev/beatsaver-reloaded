FROM node:10-alpine AS builder
WORKDIR /usr/app

COPY package.json yarn.lock ./
RUN apk add --no-cache bash git openssh make gcc g++ python
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn test && yarn build

FROM node:10-alpine
ENV NODE_ENV=production

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY package.json yarn.lock ./
RUN apk add --no-cache tini bash git openssh make gcc g++ python && \
  yarn install --frozen-lockfile --production && \
  yarn run modclean && \
  apk del bash git openssh make gcc g++ python

USER node
COPY --from=builder --chown=node:node /usr/app/build ./build

ARG VCS_REF
LABEL org.label-schema.vcs-ref=$VCS_REF \
  org.label-schema.vcs-url="https://github.com/lolPants/beatsaver-reloaded"

VOLUME ["/home/node/app/cdn"]
ENTRYPOINT ["/sbin/tini", "--"]
EXPOSE 3000
CMD ["node", "."]
