# Guide d'installation et utilisation - Conexa (sans Docker)

## Prérequis

### 1. Node.js et Yarn

```bash
# Installer Node.js (version 18+)
# Télécharger depuis https://nodejs.org/

# Installer Yarn
npm install -g yarn
```

### 2. PostgreSQL

```bash
# Sur macOS avec Homebrew
brew install postgresql
brew services start postgresql

# Ou utiliser Postgres.app
# Télécharger depuis https://postgresapp.com/
```

## Installation

### 1. Cloner et installer les dépendances

```bash
cd /Users/adel/Desktop/bureau/Ynov/Conexa
yarn install
```

### 2. Configuration de la base de données

```bash
# Créer l'utilisateur et la base de données
createuser -s conexa_user
createdb -O conexa_user conexa_db
psql -d postgres -c "ALTER USER conexa_user WITH PASSWORD 'conexa_pass';"
```

### 3. Initialiser Prisma

```bash
yarn workspace api prisma generate
yarn workspace api prisma db push
```

## Démarrage

### Option 1: Script automatique (recommandé)

```bash
./start.sh
```

### Option 2: Démarrage manuel

```bash
# Dans le terminal principal
yarn dev
```

### Option 3: Démarrage séparé

```bash
# Terminal 1: API
yarn dev:api

# Terminal 2: Web
yarn dev:web
```

## URLs disponibles

- **Application Web**: http://localhost:3000
- **API REST**: http://localhost:3001
- **Documentation Swagger**: http://localhost:3001/api/docs
- **Prisma Studio**: yarn prisma:studio (http://localhost:5555)

## Commandes utiles

```bash
# Démarrer tout
yarn dev

# Prisma Studio (interface graphique DB)
yarn prisma:studio

# Appliquer les migrations
yarn prisma:migrate

# Reset la base de données
yarn prisma:reset

# Synchroniser le schéma avec la DB
yarn db:setup

# Tests
yarn test

# Lint
yarn lint

# Build
yarn build
```

## Structure des ports

- **3000**: Next.js (Frontend)
- **3001**: NestJS (Backend API)
- **5432**: PostgreSQL
- **5555**: Prisma Studio

## Variables d'environnement

Les fichiers suivants sont configurés :

- `.env` (racine)
- `apps/api/.env` (backend)
- `apps/web/.env.local` (frontend)

## Dépannage

### PostgreSQL ne démarre pas

```bash
brew services restart postgresql
```

### Erreur de connexion à la DB

```bash
# Vérifier que PostgreSQL fonctionne
brew services list | grep postgres

# Recréer la base de données
yarn prisma:reset
```

### Problème de permissions

```bash
# Donner les permissions complètes à l'utilisateur
psql -d postgres -c "ALTER USER conexa_user WITH SUPERUSER;"
```
