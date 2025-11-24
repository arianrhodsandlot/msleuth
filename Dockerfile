FROM oven/bun:alpine AS builder
WORKDIR /app
RUN apk update && \
    apk add unzip
COPY package.json bun.lock ./
RUN bun i
COPY src src
RUN bun build
ADD https://buildbot.libretro.com/assets/frontend/database-rdb.zip tmp/inputs/libretro/database-rdb.zip
ADD https://gamesdb.launchbox-app.com/Metadata.zip tmp/inputs/launchbox/metadata.zip
RUN bun build:db

FROM oven/bun:alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/msleuth.sqlite ./msleuth.sqlite

EXPOSE 3000
ENV BUN_ENV=production
CMD ["bun", "dist"]
