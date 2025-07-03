FROM node:alpine AS builder
WORKDIR /app
RUN apk update && \
    apk add unzip && \
    npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm i
COPY src src
RUN node --run=build:template && node --run=build
ADD https://buildbot.libretro.com/assets/frontend/database-rdb.zip tmp/inputs/libretro/database-rdb.zip
ADD https://gamesdb.launchbox-app.com/metadata.zip tmp/inputs/launchbox/metadata.zip
RUN node --run=build:db

FROM oven/bun:alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/msleuth.sqlite ./msleuth.sqlite

EXPOSE 3000
ENV NODE_ENV=production
CMD ["bun", "dist"]
