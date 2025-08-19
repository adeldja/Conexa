'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Dashboard Conexa
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Bonjour, {user?.fullName || user?.email}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user?.role}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Bienvenue sur Conexa !
                </h2>
                <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Informations de votre compte
                  </h3>
                  <dl className="space-y-2 text-left">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">{user?.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Nom</dt>
                      <dd className="text-sm text-gray-900">{user?.fullName || 'Non renseigné'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Rôle</dt>
                      <dd className="text-sm text-gray-900">{user?.role}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Membre depuis</dt>
                      <dd className="text-sm text-gray-900">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Section des fonctionnalités disponibles selon le rôle */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Fonctionnalités disponibles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    
                    {user?.role === 'PROVIDER' && (
                      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                        <h4 className="font-semibold text-gray-900 mb-2">Gestion des créneaux</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Créez et gérez vos créneaux horaires pour permettre aux clients de prendre rendez-vous.
                        </p>
                        <Link href="/dashboard/slots">
                          <span className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                            Gérer mes créneaux
                          </span>
                        </Link>
                      </div>
                    )}
                    
                    {user?.role === 'CLIENT' && (
                      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                        <h4 className="font-semibold text-gray-900 mb-2">Prise de rendez-vous</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Consultez les disponibilités et prenez rendez-vous avec un prestataire.
                        </p>
                        <Link href="/dashboard/bookings">
                          <span className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                            Prendre rendez-vous
                          </span>
                        </Link>
                      </div>
                    )}
                    
                    {user?.role === 'ADMIN' && (
                      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                        <h4 className="font-semibold text-gray-900 mb-2">Administration</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Gérez les utilisateurs et les paramètres de la plateforme.
                        </p>
                        <button disabled className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400">
                          Bientôt disponible
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
