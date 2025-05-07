# apps/api/Dockerfile

# --- Build Stage ---
FROM node:20-slim AS builder
WORKDIR /app

# 1) Copier le manifest de l’API
COPY apps/api/package.json apps/api/

# 2) Installer les dépendances (dev+prod) de l’API
RUN yarn install --cwd apps/api --frozen-lockfile

# 3) Copier le code source et builder l’API
COPY apps/api ./apps/api
WORKDIR /app/apps/api
RUN yarn build

# --- Production Stage ---
FROM node:20-slim AS runner
WORKDIR /app/apps/api
ENV NODE_ENV=production

# Copier node_modules et le dist buildé depuis builder
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist         ./dist

EXPOSE 3001
CMD ["node", "dist/main.js"]
