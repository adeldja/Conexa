# apps/web/Dockerfile

# --- Build Stage ---
FROM node:20-slim AS builder
WORKDIR /app

# 1) Copier le manifest du frontend
COPY apps/web/package.json apps/web/

# 2) Installer les dépendances (dev+prod) du frontend
WORKDIR /app/apps/web
RUN npm install

# 3) Copier le code source et builder Next.js
COPY apps/web ./
RUN npm run build

# --- Production Stage ---
FROM node:20-slim AS runner
WORKDIR /app/apps/web
ENV NODE_ENV=production

# 1) Copier package.json pour que `npm start` sache quoi faire
COPY --from=builder /app/apps/web/package.json    ./package.json

# 2) Copier node_modules et les artefacts Next.js
COPY --from=builder /app/apps/web/node_modules    ./node_modules
COPY --from=builder /app/apps/web/.next            ./.next
COPY --from=builder /app/apps/web/public           ./public

EXPOSE 3000
CMD ["npm", "start"]
