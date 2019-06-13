FROM node:10-alpine AS builder
WORKDIR /usr/app

COPY package.json yarn.lock ./
RUN apk add --no-cache bash git openssh
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM nginx:alpine

COPY --from=builder /usr/app/content/.vuepress/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

ARG VCS_REF
LABEL org.label-schema.vcs-ref=$VCS_REF \
  org.label-schema.vcs-url="https://github.com/lolPants/beatsaver-reloaded"

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
