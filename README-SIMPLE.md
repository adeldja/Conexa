# Conexa - Plateforme de réservation

Plateforme de prise de rendez-vous en ligne (NestJS + Next.js + PostgreSQL).

## Démarrage rapide

```bash
# Option 1: Commande unique
yarn start

# Option 2: Script
./start-dev.sh

# Option 3: Manuel
yarn db:start  # PostgreSQL (Docker)
yarn dev       # API + Web
```

## Services

- **Web**: http://localhost:3000
- **API**: http://localhost:3001
- **DB**: localhost:5432

## Commandes

```bash
yarn start     # Tout démarrer
yarn dev       # API + Web seulement
yarn db:start  # PostgreSQL seulement
yarn db:stop   # Arrêter PostgreSQL
yarn db:reset  # Reset PostgreSQL
```
