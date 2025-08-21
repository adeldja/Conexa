'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui';
import { seederService } from '@/services/seederService';

export default function AdminSeederPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  // Vérifier que l'utilisateur est admin
  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
          <p className="text-gray-600">Cette page est réservée aux administrateurs.</p>
        </Card>
      </div>
    );
  }

  const handleSeed = async (action: string) => {
    setIsLoading(true);
    setResults([]);
    
    try {
      let result;
      switch (action) {
        case 'specialties':
          result = await seederService.seedSpecialties();
          break;
        case 'users':
          result = await seederService.seedUsers();
          break;
        case 'profiles':
          result = await seederService.seedProfiles();
          break;
        case 'all':
          result = await seederService.seedAll();
          break;
        case 'reset':
          result = await seederService.resetDatabase();
          break;
        default:
          throw new Error('Action non reconnue');
      }
      
      setResults(Array.isArray(result.message) ? result.message : [result.message]);
    } catch (error) {
      setResults([`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const seedActions = [
    {
      id: 'specialties',
      title: 'Créer les spécialités',
      description: 'Ajoute les spécialités de base (Coaching sportif, Consultation juridique, etc.)',
      color: 'blue',
      icon: '🏷️'
    },
    {
      id: 'users',
      title: 'Créer des utilisateurs de test',
      description: 'Ajoute des utilisateurs de test (clients et prestataires)',
      color: 'green',
      icon: '👥'
    },
    {
      id: 'profiles',
      title: 'Créer les profils',
      description: 'Ajoute des profils client et prestataire pour les utilisateurs de test',
      color: 'purple',
      icon: '📋'
    },
    {
      id: 'all',
      title: 'Créer tout',
      description: 'Exécute tous les seeders dans l\'ordre',
      color: 'indigo',
      icon: '🚀'
    },
    {
      id: 'reset',
      title: 'Réinitialiser la BDD',
      description: 'ATTENTION: Supprime toutes les données et recrée les tables',
      color: 'red',
      icon: '🗑️'
    }
  ];

  const getButtonClasses = (color: string) => {
    const baseClasses = "w-full px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50";
    const colorClasses = {
      blue: "bg-blue-600 hover:bg-blue-700 text-white",
      green: "bg-green-600 hover:bg-green-700 text-white",
      purple: "bg-purple-600 hover:bg-purple-700 text-white",
      indigo: "bg-indigo-600 hover:bg-indigo-700 text-white",
      red: "bg-red-600 hover:bg-red-700 text-white"
    };
    return `${baseClasses} ${colorClasses[color as keyof typeof colorClasses]}`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🛠️ Administration - Création BDD
        </h1>
        <p className="text-gray-600">
          Outils pour initialiser et gérer les données de la base de données
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {seedActions.map((action) => (
          <Card key={action.id} className="p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">{action.icon}</span>
              <h3 className="text-lg font-semibold text-gray-900">
                {action.title}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">
              {action.description}
            </p>
            
            <button
              onClick={() => handleSeed(action.id)}
              disabled={isLoading}
              className={getButtonClasses(action.color)}
            >
              {isLoading ? 'Traitement...' : 'Exécuter'}
            </button>
          </Card>
        ))}
      </div>

      {/* Résultats */}
      {results.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📄 Résultats
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="text-sm text-gray-700 mb-2">
                {result}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
