# Architecture du projet Conexa

## 📁 Structure actuelle des dossiers

```
src/
├── app/                          # Next.js App Router (v13+)
│   ├── api/                     # Routes API Next.js
│   ├── dashboard/               # Pages du tableau de bord
│   ├── login/                   # Page de connexion
│   ├── register/                # Page d'inscription
│   ├── providers/               # Pages des prestataires
│   ├── sentry-example-page/     # Page d'exemple Sentry
│   ├── layout.tsx               # Layout racine
│   ├── page.tsx                 # Page d'accueil
│   ├── globals.css              # Styles globaux
│   └── favicon.ico              # Icône du site
│
├── components/                   # Composants organisés par type
│   ├── ui/                      # Composants de base réutilisables
│   │   ├── Badge.tsx            # Badges et étiquettes
│   │   ├── Button.tsx           # Boutons avec variants
│   │   ├── Card.tsx             # Cartes conteneurs
│   │   ├── Input.tsx            # Champs de saisie
│   │   ├── Select.tsx           # Sélecteurs déroulants
│   │   ├── Skeleton.tsx         # États de chargement
│   │   ├── Slider.tsx           # Curseurs de valeurs
│   │   ├── StarRating.tsx       # Système de notation
│   │   ├── Table.tsx            # Tableaux de données
│   │   ├── Toast.tsx            # Notifications
│   │   └── index.ts             # Exports centralisés
│   │
│   ├── features/                # Composants métier par fonctionnalité
│   │   ├── booking/             # Gestion des réservations
│   │   ├── dashboard/           # Éléments du tableau de bord
│   │   ├── slots/               # Gestion des créneaux
│   │   ├── specialties/         # Gestion des spécialités
│   │   ├── ProviderCard.tsx     # Carte prestataire
│   │   ├── SpecialtyCard.tsx    # Carte spécialité
│   │   └── index.ts
│   │
│   ├── booking/                 # Composants de réservation legacy
│   ├── forms/                   # Formulaires spécialisés
│   ├── layout/                  # Composants de mise en page
│   ├── modals/                  # Modales et popups
│   ├── shared/                  # Composants partagés
│   └── index.ts
│
├── hooks/                       # Custom hooks React
│   ├── useBookingLogic.ts       # Logique de réservation
│   ├── useSpecialties.ts        # Gestion des spécialités
│   └── index.ts
│
├── services/                    # Services API et logique métier
│   ├── auth.ts                  # Authentification
│   ├── availability.ts          # Disponibilités
│   ├── booking.ts               # Réservations
│   ├── specialtyService.ts      # Spécialités
│   ├── profileService.ts        # Profils utilisateur
│   ├── profilesService.ts       # Service profiles étendu
│   ├── reviewService.ts         # Avis et évaluations
│   ├── advancedSlotsService.ts  # Créneaux avancés
│   └── index.ts
│
├── types/                       # Définitions TypeScript
│   ├── auth.ts                  # Types d'authentification
│   ├── profiles.ts              # Types de profils
│   └── types.ts                 # Types généraux
│
├── utils/                       # Fonctions utilitaires
│   ├── date.ts                  # Manipulation des dates
│   ├── apiClient.ts             # Client API configuré
│   ├── apiConfig.ts             # Configuration API
│   ├── authManager.ts           # Gestion de l'authentification
│   ├── cn.ts                    # Utilitaire de classes CSS
│   ├── id.ts                    # Génération d'identifiants
│   ├── slotConverter.ts         # Conversion de créneaux
│   ├── slotGenerator.ts         # Génération de créneaux
│   ├── utils.ts                 # Utilitaires généraux
│   └── index.ts
│
├── contexts/                    # Contextes React
│   └── AuthContext.tsx          # Contexte d'authentification
│
├── lib/                         # Bibliothèques et configurations
├── styles/                      # Styles et thèmes
├── apiConfig.ts                 # Configuration API principale
├── instrumentation.ts           # Instrumentation Sentry
└── instrumentation-client.ts    # Instrumentation côté client
```

## 🎯 Points forts de l'architecture actuelle

### 1. **Composants UI robustes**

- **Design System complet** : Badge, Button, Card, Input, Select, etc.
- **Composants avancés** : StarRating, Table, Toast, Skeleton
- **États de chargement** intégrés avec Skeleton
- **Système de notification** avec Toast

### 2. **Architecture en couches bien définie**

```tsx
// Exemple d'utilisation des couches
import { Button, Card, StarRating } from '@/components/ui';
import { ProviderCard } from '@/components/features';
import { useSpecialties } from '@/hooks';
import { specialtyService } from '@/services';
```

### 3. **Services API organisés**

- **spécialisation par domaine** : auth, booking, profiles, specialties
- **Service avancé** pour les créneaux (advancedSlotsService)
- **Gestion centralisée** des appels API
- **Types TypeScript** pour la sécurité

### 4. **Hooks métier spécialisés**

- `useBookingLogic` : Logique complexe de réservation
- `useSpecialties` : Gestion des spécialités (récemment corrigé)
- Réutilisabilité et testabilité

### 5. **Utilitaires complets**

- **Gestion des dates** : formatage, manipulation, conversion
- **Génération de créneaux** : slotGenerator, slotConverter
- **Authentification** : authManager centralisé
- **Configuration API** : apiClient, apiConfig

### 6. **Types TypeScript exhaustifs**

- **Types métier** : profiles.ts avec ProviderProfile, Specialty, etc.
- **Types d'auth** : User, AuthState, etc.
- **Types généraux** : types.ts pour les utilitaires

## 🚀 Fonctionnalités récemment corrigées

### ✅ **Gestion des spécialités** (Août 2025)

- **Hook useSpecialties** : Boucle infinie corrigée (suppression de `error` dans
  les dépendances useEffect)
- **Service specialtyService** : Ajout et suppression fonctionnels avec gestion
  d'erreurs appropriée
- **Backend synchronisé** : ProviderProfile automatique lors de la création
  d'utilisateur PROVIDER
- **Validation des données** : Types TypeScript stricts pour les requêtes API

### 🧹 **Code nettoyé et sécurisé** (Août 2025)

- **Authentification stricte** : Suppression des fallbacks temporaires dangereux
- **Logs de debug supprimés** : Code de production propre sans console.log de
  debug
- **DTOs nettoyés** : Suppression des champs temporaires (`userId`, `clientId`)
  dans les DTOs
- **Intercepteur axios configuré** : Token d'authentification automatique sur
  toutes les requêtes
- **Gestion d'erreurs améliorée** : Les composants gèrent leurs propres erreurs
  401 sans redirection forcée
- **Contrôleurs backend sécurisés** : `UnauthorizedException` obligatoire pour
  les routes protégées

### ⚠️ **Points d'attention**

- **Gestion des créneaux** : Sensible aux changements d'authentification
- **Services doubles** : `profileService` vs `profilesService` à unifier
- **Composants legacy** : Dossier `booking/` racine à nettoyer

## 🔧 Améliorations techniques

### 1. **Performance**

- Composants UI optimisés avec Skeleton
- Lazy loading potentiel sur les features
- Index files pour des imports propres

### 2. **Maintenabilité**

- Structure modulaire par domaine
- Séparation claire UI/métier/services
- Types TypeScript complets

### 3. **Sécurité et Authentification**

- **Authentification JWT** : Système complet avec tokens Bearer
- **Intercepteur axios** : Ajout automatique du token sur toutes les requêtes
- **Gestion des erreurs 401** : Flexible, sans redirection forcée
- **Validation des permissions** : Contrôleurs backend sécurisés
- **Stockage sécurisé** : localStorage pour tokens avec vérification côté
  serveur

## � Prochaines étapes recommandées

### 🎯 **Court terme**

1. **Nettoyer les composants legacy** (dossier `booking/` racine)
2. **Unifier les services profiles** (profileService vs profilesService)
3. **Tester la gestion des créneaux** après les changements d'authentification

### 🚀 **Moyen terme**

1. **Optimiser le design system** avec des tokens de design
2. **Ajouter des composants manquants** : Modal, Dropdown, Tooltip
3. **Implémenter des tests unitaires** pour les hooks critiques

### 🎨 **Long terme**

1. **Thème cohérent** avec variables CSS
2. **Documentation Storybook** pour le design system
3. **Tests d'intégration** pour les features critiques
4. **Monitoring avancé** avec Sentry pour la production

## 🔒 **Sécurité et Bonnes Pratiques**

### ✅ **Authentification**

- Token JWT stocké en localStorage
- Intercepteur axios pour ajout automatique du Bearer token
- Validation stricte côté backend avec UnauthorizedException
- Gestion flexible des erreurs 401 (pas de redirection forcée)

### ✅ **Code Quality**

- Types TypeScript stricts
- Suppression des fallbacks temporaires dangereux
- Logs de debug supprimés pour la production
- DTOs nettoyés sans champs de test

### ⚠️ **Points de vigilance**

- **Services en doublon** : Unifier profileService/profilesService
- **Composants legacy** : Nettoyer le dossier booking/
- **Gestion d'erreurs** : Vérifier la compatibilité avec les créneaux

Cette architecture est maintenant **sécurisée et prête pour la production** avec
une authentification robuste et un code nettoyé !
