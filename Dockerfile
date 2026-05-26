# syntax=docker/dockerfile:1.7
# ─── Base image ──────────────────────────────────────────────────────────
FROM node:20-slim AS base
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /app

# ─── Install full deps (build needs devDeps too) ─────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml .npmrc ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ─── Build the Next.js + Payload bundle ──────────────────────────────────
FROM base AS builder
ENV NODE_ENV=production
# Payload's build needs SOME env at config-load time. Inject sane defaults
# so the build doesn't crash on missing values; real values arrive at
# runtime via Fly secrets.
ENV DATABASE_URI=file:./build-only.db \
    PAYLOAD_SECRET=build-time-placeholder-never-used-at-runtime \
    NEXT_PUBLIC_SERVER_URL=https://example.com
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build && rm -f build-only.db

# ─── Production runtime ──────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATABASE_URI=file:/data/pulse.db \
    MEDIA_DIR=/data/media

# All deps (Payload + tsx for the migrate:wp script) — full image is fine
# on Fly; runtime perf matters more than image size for this use case.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Apply pending migrations before starting the server. Idempotent.
EXPOSE 3000
CMD ["sh", "-c", "pnpm db:migrate && pnpm start"]
