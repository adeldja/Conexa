# 🏥 Conexa - Plateforme de Prise de Rendez-vous Médicaux

<div align="center">
  <img src="public/conexa-logo-full.svg" alt="Conexa Logo" width="300"/>
  
  [![CI/CD Pipeline](https://github.com/username/conexa/actions/workflows/ci.yml/badge.svg)](https://github.com/username/conexa/actions)
  [![Test Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen.svg)](./coverage)
</div>

## 📋 Description

**Conexa** est une plateforme moderne de gestion de rendez-vous médicaux
développée pour faciliter la coordination entre patients et professionnels de
santé. La solution offre une interface intuitive pour :

- 📅 **Gestion des créneaux** : Création et modification des disponibilités
- 🩺 **Spécialités médicales** : Support de multiples spécialités
- 👥 **Gestion des utilisateurs** : Patients et praticiens
- 📊 **Tableaux de bord** : Suivi des rendez-vous et statistiques
- 🔒 **Sécurité** : Authentification JWT et protection des données

## 🚀 Stack Technique

### Frontend

- **Next.js 14** - Framework React avec SSR/SSG
- **React 18** - Interface utilisateur moderne
- **TypeScript** - Typage statique pour la robustesse
- **Tailwind CSS** - Styling utilitaire et responsive
- **Zustand** - Gestion d'état légère

### Backend

- **NestJS** - Framework Node.js scalable
- **Prisma ORM** - Gestion de base de données type-safe
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification sécurisée
- **Swagger** - Documentation API automatique

### DevOps & Outils

- **Turborepo** - Monorepo haute performance
- **Jest** - Tests unitaires et d'intégration
- **Testing Library** - Tests composants React
- **ESLint & Prettier** - Qualité et formatage du code
- **GitHub Actions** - CI/CD automatisé
- **Vercel** - Déploiement frontend
- **Render** - Déploiement backend

## 📁 Structure du Projet

```
conexa/
├── 📂 apps/
│   ├── 📂 api/                    # Backend NestJS
│   │   ├── 📂 src/
│   │   │   ├── 📂 modules/        # Modules métier (booking, auth, users...)
│   │   │   ├── 📂 interceptors/   # Intercepteurs globaux
│   │   │   └── 📂 prisma/         # Service Prisma
│   │   ├── 📂 prisma/             # Schémas et migrations
│   │   └── 📂 test/               # Tests e2e
│   └── 📂 web/                    # Frontend Next.js
│       ├── 📂 src/
│       │   ├── 📂 app/            # Pages Next.js (App Router)
│       │   ├── 📂 components/     # Composants React
│       │   ├── 📂 contexts/       # Contextes React
│       │   ├── 📂 hooks/          # Hooks personnalisés
│       │   ├── 📂 services/       # Services API
│       │   └── 📂 types/          # Types TypeScript
│       └── 📂 __tests__/          # Tests unitaires
├── 📂 packages/
│   └── 📂 ui/                     # Composants UI partagés
├── 📂 monitoring/                 # Configuration Grafana
└── 📄 Documentation complète
```

## ⚡ Démarrage Rapide

### Prérequis

- **Node.js** 18+
- **Yarn** (recommandé) ou npm
- **PostgreSQL** 15+
- **Git**

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/username/conexa.git
cd conexa

# 2. Installer les dépendances
yarn install

# 3. Configuration environnement
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 4. Configurer la base de données PostgreSQL
# Éditer apps/api/.env avec vos paramètres

# 5. Initialiser la base de données
cd apps/api
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed

# 6. Retour à la racine et démarrage
cd ../..
yarn dev
```

### Variables d'Environnement

#### Backend (`apps/api/.env`)

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/conexa_dev"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Serveur
PORT=3001
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

#### Frontend (`apps/web/.env.local`)

```env
# API Backend
NEXT_PUBLIC_API_URL="http://localhost:3001"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Sentry (optionnel)
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
```

## 🛠️ Scripts Disponibles

### Développement

```bash
yarn dev              # Démarrer en mode développement (frontend + backend)
yarn dev:web          # Frontend uniquement (port 3000)
yarn dev:api          # Backend uniquement (port 3001)
```

### Build & Production

```bash
yarn build            # Build complet du monorepo
yarn start            # Démarrer en production
yarn start:web        # Frontend en production
yarn start:api        # Backend en production
```

### Tests & Qualité

```bash
yarn test             # Tests unitaires
yarn test:coverage    # Tests avec couverture
yarn test:e2e         # Tests end-to-end
yarn lint             # Linting ESLint
yarn format           # Formatage Prettier
yarn format:check     # Vérification formatage
```

### Base de Données

```bash
yarn db:generate      # Générer le client Prisma
yarn db:migrate       # Exécuter les migrations
yarn db:seed          # Peupler avec des données de test
yarn db:studio        # Interface graphique Prisma Studio
yarn db:reset         # Reset complet de la DB
```

## 🧪 Tests

Le projet maintient une couverture de tests élevée :

- **Backend** : 85%+ de couverture
- **Frontend** : 80%+ de couverture

```bash
# Tests unitaires backend
cd apps/api && yarn test

# Tests unitaires frontend
cd apps/web && yarn test

# Couverture complète
yarn test:coverage

# Tests e2e
yarn test:e2e
```

## 🚀 Déploiement

### Environnements

| Environnement     | Frontend           | Backend                | Base de Données   |
| ----------------- | ------------------ | ---------------------- | ----------------- |
| **Développement** | localhost:3000     | localhost:3001         | PostgreSQL local  |
| **Staging**       | staging.conexa.app | api-staging.conexa.app | PostgreSQL Render |
| **Production**    | conexa.app         | api.conexa.app         | PostgreSQL Render |

### CI/CD

Le pipeline GitHub Actions automatise :

- ✅ **Tests** : Unitaires, intégration, e2e
- ✅ **Qualité** : Linting, formatage, sécurité
- ✅ **Build** : Compilation TypeScript, optimisation
- ✅ **Deploy** : Vercel (frontend), Render (backend)

### Commandes de Déploiement

```bash
# Deploy manuel (si nécessaire)
yarn deploy:web       # Déployer frontend sur Vercel
yarn deploy:api       # Déployer backend sur Render
```

## 📚 Documentation

| Document                                                  | Description                      |
| --------------------------------------------------------- | -------------------------------- |
| [📖 Manuel d'Utilisation](MANUEL-UTILISATION.md)          | Guide complet utilisateur        |
| [🏗️ Architecture](apps/web/ARCHITECTURE.md)               | Architecture technique détaillée |
| [⚙️ Installation](SETUP.md)                               | Guide d'installation détaillé    |
| [🧪 Tests](TESTS.md)                                      | Stratégie et guide de tests      |
| [🔄 CI/CD](CI-CD.md)                                      | Pipeline d'intégration continue  |
| [🐛 Gestion Anomalies](ANOMALIES-MANAGEMENT.md)           | Process de gestion des bugs      |
| [♿ Accessibilité](ACCESSIBILITE-GUIDE-IMPLEMENTATION.md) | Guide d'accessibilité RGAA       |

## 🔧 API Documentation

L'API est documentée avec Swagger/OpenAPI :

- **Local** : http://localhost:3001/api/docs
- **Production** : https://api.conexa.app/docs

### Endpoints Principaux

```
GET    /api/health              # Health check
POST   /api/auth/login          # Authentification
GET    /api/users/profile       # Profil utilisateur
GET    /api/specialties         # Liste des spécialités
GET    /api/availability        # Créneaux disponibles
POST   /api/booking             # Créer un rendez-vous
PUT    /api/booking/:id         # Modifier un rendez-vous
DELETE /api/booking/:id         # Annuler un rendez-vous
```

## 🤝 Contribution

Nous accueillons les contributions ! Voici comment procéder :

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Développer** avec tests
4. **Commiter** (`git commit -m 'feat: add amazing feature'`)
5. **Pousser** (`git push origin feature/amazing-feature`)
6. **Ouvrir** une Pull Request

### Conventions

- **Commits** : [Conventional Commits](https://conventionalcommits.org/)
- **Code** : ESLint + Prettier configurés
- **Tests** : Obligatoires pour nouvelles features
- **Documentation** : Mise à jour si nécessaire

## 📈 Monitoring & Performance

- **Métriques** : Prometheus + Grafana
- **Erreurs** : Sentry intégré
- **Performance** : Web Vitals trackées
- **Logs** : Structured logging avec Winston

## 🆘 Support & FAQ

### Questions Fréquentes

**Q: Comment réinitialiser ma base de données locale ?**

```bash
yarn db:reset
```

**Q: L'API ne répond pas, que faire ?**

```bash
# Vérifier les logs
cd apps/api && yarn logs
# Redémarrer le service
yarn dev:api
```

**Q: Comment ajouter une nouvelle spécialité médicale ?** Voir le
[Manuel d'Utilisation](MANUEL-UTILISATION.md#ajout-specialite)

### Support

- 🐛 **Bugs** : [GitHub Issues](https://github.com/username/conexa/issues)
- 💬 **Discussions** :
  [GitHub Discussions](https://github.com/username/conexa/discussions)
- 📧 **Contact** : support@conexa.app

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus
de détails.

---

<div align="center">
  <p>Développé avec ❤️ par l'équipe Conexa</p>
  <p>
    <a href="https://conexa.app">🌐 Site Web</a> •
    <a href="https://api.conexa.app/docs">📚 API Docs</a> •
    <a href="https://github.com/username/conexa/issues">🐛 Report Bug</a> •
    <a href="https://github.com/username/conexa/discussions">💬 Discussions</a>
  </p>
</div>
