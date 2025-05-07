# Conexa

**Conexa** est un monorepo full-stack réunissant :

* **Frontend :** Next.js (React) + TypeScript + Tailwind CSS
* **Backend :** NestJS (Node.js) + TypeScript
* **Monorepo :** Yarn Workspaces + Turborepo
* **DB suggérée :** PostgreSQL
* **Conteneurisation :** Docker & Docker Compose
* **CI/CD :** GitHub Actions (tests & lint sur chaque commit/PR)

---

## 🗂 Structure du projet

```
Conexa/                # racine monorepo
├─ apps/
│  ├─ web/             # Next.js frontend
│  │  ├─ public/
│  │  ├─ src/
│  │  └─ Dockerfile
│  └─ api/             # NestJS backend
│     ├─ src/
│     └─ Dockerfile
├─ packages/
│  └─ ui/              # composants partagés
├─ .github/            # workflows CI (tests & lint)
├─ docker-compose.yml  # orchestration Docker
├─ package.json        # monorepo manifest & scripts
├─ turbo.json          # Turborepo config
└─ README.md           # documentation projet
```

---

## 🚀 Prérequis

* **Node.js** v20 (ou ≥ 20)
* **Yarn** v1.22.x
* **Docker** & **Docker Compose** (pour conteneurisation)

---

## ⚙️ Installation & développement

1. Clone le repo :

   ```bash
   git clone https://github.com/adeldja/Conexa.git
   cd Conexa
   ```
2. Installe les dépendances :

   ```bash
   yarn install
   ```
3. Démarre en mode développement :

   ```bash
   yarn dev
   ```

> `yarn dev` lance simultanément :
>
> * `yarn workspace web dev` (Next.js sur [http://localhost:3000](http://localhost:3000))
> * `yarn workspace api start:dev` (NestJS sur [http://localhost:3001](http://localhost:3001))

---

## 🐳 Docker

Pour construire et lancer tous les services via Docker :

```bash
# Build & up (détaché)
yarn deux   # alias de `docker-compose up --build -d`

# Logs
docker-compose logs -f

# Arrêt et cleanup
yarn down  # alias de `docker-compose down`
```

---

## ✔️ Tests & lint

* **Tests unitaires & e2e API** :

  ```bash
  ```

yarn workspace api test
yarn workspace api test\:e2e

````

- **Tests frontend** :  
  ```bash
yarn workspace web test
````

* **Lint** (ESLint) sur chaque workspace :

  ```bash
  ```

yarn workspace api lint
yarn workspace web lint

````

- **Workflow CI** s’exécute automatiquement sur chaque commit et PR via GitHub Actions (4 jobs séparés : tests & lint pour front et back).

---

## 📝 Variables d’environnement

Crée un fichier `.env` à la racine ou dans `apps/api` pour la configuration de la DB :

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=ton_secret_jwt
# etc.
````

---
