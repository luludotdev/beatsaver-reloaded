FROM node:10-alpine AS builder
WORKDIR /usr/app

RUN apk add --no-cache bash git openssh util-linux
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build:prod

FROM nginx:alpine

ARG VCS_REF
LABEL org.label-schema.vcs-ref=$VCS_REF \
  org.label-schema.vcs-url="https://github.com/lolPants/beatsaver-reloaded"

COPY --from=builder /usr/app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
