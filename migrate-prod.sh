#!/usr/bin/env bash
set -e
export $(grep -v '^#' .env.prod | xargs)
npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma
npx prisma db seed --schema=apps/api/prisma/schema.prisma