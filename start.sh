#!/bin/bash

echo "🚀 Démarrage de l'environnement de développement Conexa (sans Docker)"
echo ""

# Vérifier si PostgreSQL fonctionne
echo "🔍 Vérification de PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé. Installez-le avec:"
    echo "   brew install postgresql"
    echo "   brew services start postgresql"
    exit 1
fi

# Vérifier la connexion à la base de données
if ! PGPASSWORD=conexa_pass psql -h localhost -U conexa_user -d conexa_db -c '\q' 2>/dev/null; then
    echo "🗃️  Configuration de la base de données..."
    
    # Créer l'utilisateur et la base de données
    createuser -s conexa_user 2>/dev/null || echo "Utilisateur conexa_user existe déjà"
    createdb -O conexa_user conexa_db 2>/dev/null || echo "Base de données conexa_db existe déjà"
    
    # Modifier le mot de passe
    psql -d postgres -c "ALTER USER conexa_user WITH PASSWORD 'conexa_pass';" 2>/dev/null
    
    echo "✅ Base de données configurée"
fi

echo "📦 Installation des dépendances..."
yarn install

echo "🛠️  Génération du client Prisma..."
yarn workspace api prisma generate

echo "🗄️  Synchronisation de la base de données..."
yarn workspace api prisma db push

echo ""
echo "🎉 Démarrage des services..."
echo "   - API: http://localhost:3001"
echo "   - Web: http://localhost:3000"
echo "   - Swagger: http://localhost:3001/api/docs"
echo ""

# Démarrer les services en parallèle
yarn dev
