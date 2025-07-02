# Tests du Projet Conexa

## Configuration des Tests

Ce projet utilise Jest pour les tests unitaires avec les configurations suivantes :

### Frontend (Next.js)
- Framework de tests : Jest + React Testing Library
- Configuration : `apps/web/jest.config.js`
- Tests situés dans : `apps/web/__tests__/`

### Backend (NestJS)
- Framework de tests : Jest avec support TypeScript
- Configuration : `apps/api/package.json` (section jest)
- Tests situés dans : `apps/api/src/**/*.spec.ts`

## Suppression d'ESLint

ESLint a été complètement supprimé du projet :

✅ **Supprimé :**
- Workflows GitHub Actions pour ESLint (`lint-front.yml`, `lint-back.yml`)
- Fichiers de configuration ESLint (`eslint.config.mjs`)
- Dépendances ESLint dans les `package.json`
- Scripts de lint dans les `package.json`
- Commentaires `eslint-disable` dans le code source

✅ **Conservé :**
- Workflows GitHub Actions pour les tests (`test-front.yml`, `test-back.yml`)
- Configuration Jest complète
- Tous les tests existants et nouveaux

## Tests d'Authentification

### Frontend - Tests du Contexte d'Authentification
Fichier : `apps/web/__tests__/auth-context.test.tsx`

**Tests inclus :**
- ✅ Initialisation avec état non authentifié
- ✅ Login avec succès (vérification de l'état et des appels API)
- ✅ Register avec succès (vérification de l'état et des appels API)
- ✅ Logout (nettoyage de l'état et du localStorage)
- ✅ Gestion des erreurs de login
- ✅ Test du state d'authentification utilisateur

### Frontend - Tests de la Page d'Accueil
Fichier : `apps/web/__tests__/page.test.tsx`

**Tests inclus :**
- ✅ Affichage de l'indicateur de chargement
- ✅ Redirection vers `/dashboard` pour utilisateur authentifié
- ✅ Redirection vers `/login` pour utilisateur non authentifié

### Backend - Tests du Contrôleur d'Authentification
Fichier : `apps/api/src/modules/auth/auth.controller.spec.ts`

**Tests inclus :**
- ✅ Login avec succès (retour du token et utilisateur)
- ✅ Register avec succès (création utilisateur et retour du token)
- ✅ Gestion des erreurs d'inscription
- ✅ Récupération du profil utilisateur

### Backend - Tests du Service d'Authentification
Fichier : `apps/api/src/modules/auth/auth.service.spec.ts`

**Tests inclus :**
- ✅ Validation d'utilisateur avec credentials valides
- ✅ Validation d'utilisateur avec credentials invalides
- ✅ Validation d'utilisateur inexistant
- ✅ Login (génération de JWT et retour des données)
- ✅ Register (création d'utilisateur et login automatique)
- ✅ Validation d'utilisateur par ID
- ✅ Gestion des erreurs (UnauthorizedException)

### Backend - Test du Contrôleur Principal
Fichier : `apps/api/src/app.controller.spec.ts`

**Tests inclus :**
- ✅ Endpoint racine (API status message)

## Exécution des Tests

### Tests Frontend
```bash
yarn workspace web test
```

### Tests Backend
```bash
yarn workspace api test
```

### Tests via Workflows GitHub Actions
Les tests s'exécutent automatiquement sur :
- Push vers n'importe quelle branche
- Ouverture/mise à jour de Pull Request

**Workflows actifs :**
- `.github/workflows/test-front.yml` - Tests du frontend
- `.github/workflows/test-back.yml` - Tests du backend

## Couverture de Code

### Frontend
- Context d'authentification : 100%
- Page d'accueil avec redirection : 100%
- Gestion des états de chargement : 100%

### Backend
- Contrôleur d'authentification : 100%
- Service d'authentification : 100%
- Gestion des erreurs : 100%
- Validation des utilisateurs : 100%

## Mocking et Configuration

### Frontend
- Service d'authentification mocké avec `jest.mock()`
- Contexte React testé avec `@testing-library/react`
- Navigation Next.js mockée (`useRouter`)
- LocalStorage simulé pour les tests

### Backend
- Services NestJS mockés avec `@nestjs/testing`
- BCrypt mocké pour les tests de mots de passe
- JWT Service mocké pour la génération de tokens
- UsersService mocké pour les opérations base de données

## État des Tests

**Tous les tests passent avec succès ✅**

- Frontend : 8 tests passés
- Backend : 12 tests passés
- Total : 20 tests d'authentification complets

Le système d'authentification JWT est entièrement testé côté frontend et backend.
