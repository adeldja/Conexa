# 🚀 Guide de démarrage rapide - Conexa

## Prérequis

- Node.js (v16 ou supérieur)
- Yarn
- Docker (pour PostgreSQL uniquement)

## Installation et démarrage

### Option 1 : Démarrage automatique

```bash
# Tout en une commande
yarn start
```

### Option 2 : Démarrage manuel

```bash
# 1. Démarrer PostgreSQL avec Docker
yarn db:start

# 2. Installer les dépendances
yarn install

# 3. Configurer la base de données
yarn workspace api prisma:generate
yarn workspace api prisma:db:push

# 4. Démarrer l'application
yarn dev
```

### Option 3 : Script de démarrage

```bash
./start-dev.sh
```

## Services qui seront démarrés

- 🗄️ **PostgreSQL** sur `localhost:5432` (Docker)
- 🔧 **API NestJS** sur `http://localhost:3001`
- 🌐 **Interface Web Next.js** sur `http://localhost:3000`

## Commandes utiles

### Base de données

```bash
yarn db:start          # Démarrer PostgreSQL
yarn db:stop           # Arrêter PostgreSQL
yarn db:reset          # Réinitialiser PostgreSQL (⚠️ supprime les données)
yarn prisma:studio     # Interface graphique Prisma
```

### Développement

```bash
yarn dev               # Démarrer API + Web
yarn dev:api           # Démarrer uniquement l'API
yarn dev:web           # Démarrer uniquement le Web
```

### Base de données

```bash
yarn prisma:migrate    # Créer une nouvelle migration
yarn prisma:studio     # Interface graphique Prisma
```

## URLs importantes

- 🌐 Application: http://localhost:3000
- 🔧 API: http://localhost:3001
- 📚 Documentation API (Swagger): http://localhost:3001/api/docs
- 🗄️ Prisma Studio: http://localhost:5555 (après `yarn prisma:studio`)

## Variables d'environnement

Les fichiers `.env` sont déjà configurés avec les bonnes valeurs pour le
développement local.

## Résolution de problèmes

### PostgreSQL ne démarre pas

```bash
yarn db:reset
```

### Problèmes de migration Prisma

```bash
yarn workspace api prisma:generate
yarn workspace api prisma:db:push
```

### Nettoyer complètement

```bash
yarn db:stop
docker system prune -f
yarn install
yarn start
```
