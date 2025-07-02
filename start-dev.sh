#!/bin/bash

echo "🚀 Démarrage de Conexa..."

# Démarrer PostgreSQL
yarn db:start
sleep 3

# Démarrer l'application
yarn dev
