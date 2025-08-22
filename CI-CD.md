# 🚀 Configuration CI/CD - Conexa

Cette documentation explique la configuration de l'intégration continue (CI) et
du déploiement continu (CD) pour le projet Conexa.

## 📋 Vue d'ensemble

Le projet utilise **GitHub Actions** pour automatiser :

- ✅ Contrôle qualité (ESLint, Prettier)
- 🧪 Tests unitaires (Frontend & Backend)
- 🏗️ Builds de vérification
- 🔒 Audits de sécurité
- 🚀 Déploiements automatiques
- 📦 Gestion des dépendances

## 🔄 Workflows disponibles

### 1. **Continuous Integration** (`ci.yml`)

**Déclencheurs :**

- Push sur `main` ou `develop`
- Pull requests vers `main` ou `develop`

**Jobs :**

1. **📦 Setup & Cache** - Installation et mise en cache des dépendances
2. **🧹 Lint & Format Check** - Vérification ESLint et Prettier
3. **🧪 Test Backend** - Tests API avec base de données PostgreSQL
4. **🧪 Test Frontend** - Tests React/Next.js
5. **🏗️ Build Check** - Vérification des builds (API + Web)
6. **🔒 Security Audit** - Audit de sécurité des dépendances
7. **✅ Validation** - Rapport final de statut

### 2. **Deployment** (`deploy.yml`)

**Déclencheurs :**

- Push sur `main` (après CI réussie)
- Fin réussie du workflow CI

**Jobs :**

1. **🔍 Pre-deployment checks** - Vérifications préalables
2. **🏗️ Production Build** - Build optimisé pour la production
3. **💨 Smoke Tests** - Tests de validation post-build
4. **📢 Deployment Notification** - Notifications de statut

### 3. **Dependencies Management** (`dependencies.yml`)

**Déclencheurs :**

- Planifié (tous les lundis à 9h UTC)
- Exécution manuelle

**Jobs :**

1. **🔒 Security Audit** - Audit hebdomadaire de sécurité
2. **📦 Check Outdated Dependencies** - Vérification des mises à jour
3. **🧹 Cache Cleanup** - Nettoyage des caches
4. **🔐 Validate Lockfiles** - Validation des fichiers de verrouillage
5. **📋 Health Report** - Rapport de santé global

## 🛠️ Scripts CI

Le fichier `package.json` contient des scripts spécialement conçus pour la CI :

```bash
# Scripts CI principaux
yarn ci              # Installation + qualité + build complet
yarn ci:lint         # Linting uniquement
yarn ci:test         # Tests avec couverture
yarn ci:build        # Build uniquement
yarn ci:security     # Audit de sécurité

# Scripts de validation
yarn validate        # Lint + format check
yarn precommit       # Script de pré-commit
yarn quality         # Contrôle qualité complet
```

## 🔧 Configuration des environnements

### Variables d'environnement requises

**Pour les tests :**

- `NEXT_PUBLIC_API_URL` (Frontend)
- `DATABASE_URL` (Backend)
- `JWT_SECRET` (Backend)
- `NODE_ENV=test`

**Pour la production :**

- `PRODUCTION_API_URL` (secret)
- `DATABASE_URL` (secret)
- `JWT_SECRET` (secret)

### Configuration des secrets GitHub

Dans **Settings > Secrets and variables > Actions**, ajoutez :

```
PRODUCTION_API_URL=https://api.votre-domaine.com
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=votre-secret-jwt-securise
```

## 📊 Rapports et couverture

### Couverture de code

- **Codecov** : Intégration automatique pour les rapports de couverture
- **Frontend** : Rapports Jest avec seuils configurés
- **Backend** : Couverture NestJS/Jest

### Artefacts générés

- 📄 Rapports de sécurité
- 📋 Analyses de dépendances obsolètes
- 🏗️ Builds de production
- 📊 Rapports de couverture

## 🚦 Statuts des checks

### ✅ Critères de passage

Pour qu'une PR soit mergeable :

1. ✅ **Lint** : Aucune erreur ESLint
2. ✅ **Format** : Code formaté avec Prettier
3. ✅ **Tests Backend** : Tous les tests API passent
4. ✅ **Tests Frontend** : Tous les tests React passent
5. ✅ **Build** : Les deux applications se construisent sans erreur

### ⚠️ Checks optionnels

- 🔒 **Security Audit** : Peut échouer sans bloquer (warnings)
- 📦 **Dependencies** : Informatif uniquement

## 🔄 Optimisations des performances

### Cache stratégique

1. **Cache Yarn** : Réutilisation des dépendances téléchargées
2. **Cache node_modules** : Évite la réinstallation complète
3. **Cache Turbo** : Accélération des builds répétitifs

### Parallélisation

- Tests Frontend et Backend en parallèle
- Builds API et Web simultanés
- Jobs indépendants pour optimiser le temps total

## 🚀 Workflow de développement

### Branches protégées

- **`main`** : Production, nécessite review + CI ✅
- **`develop`** : Développement, nécessite CI ✅

### Process recommandé

1. 🌿 Créer une branche feature : `git checkout -b feature/nom-feature`
2. 💻 Développer et commiter
3. 🧪 Tester localement : `yarn quality`
4. 📤 Pousser et créer une PR
5. ⏳ Attendre la validation CI
6. 👀 Review de code
7. ✅ Merge après validation

## 🔧 Dépannage

### Échecs fréquents

**❌ Lint failed**

```bash
# Corriger localement
yarn lint:fix
yarn format
```

**❌ Tests failed**

```bash
# Exécuter les tests localement
yarn test
```

**❌ Build failed**

```bash
# Vérifier les builds
yarn build
```

### Logs utiles

- **Actions tab** : Logs détaillés de chaque job
- **Artifacts** : Télécharger les rapports générés
- **Cache hits** : Vérifier l'efficacité du cache
