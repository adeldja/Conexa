'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useState } from 'react';

// Composants d'icônes SVG simples
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const ChartBarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatMemberSince = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header moderne avec logo et menu utilisateur */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo et nom */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Conexa</h1>
                  <p className="text-xs text-slate-500">Dashboard Provider</p>
                </div>
              </div>

              {/* Menu utilisateur */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.fullName ? getInitials(user.fullName) : getInitials(user?.email || 'U')}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-slate-700">
                      {user?.fullName || user?.email}
                    </p>
                    <p className="text-xs text-slate-500">{user?.role}</p>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        // Ici vous pourriez ajouter une navigation vers les paramètres
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <CogIcon className="w-4 h-4 mr-3" />
                      Paramètres
                    </button>
                    <hr className="my-1 border-slate-200" />
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <LogoutIcon className="w-4 h-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          {/* Message d'accueil personnalisé */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Bienvenue, {user?.fullName || user?.email?.split('@')[0]} 👋
            </h2>
            <p className="text-slate-600">
              Gérez vos créneaux et suivez votre activité depuis votre tableau de bord.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Informations du compte - Version mobile-first */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center space-x-4 mb-6">
                  {/* Avatar plus grand */}
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {user?.fullName ? getInitials(user.fullName) : getInitials(user?.email || 'U')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {user?.fullName || 'Utilisateur'}
                    </h3>
                    {/* Badge rôle amélioré */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-slate-500 mb-1">Email</dt>
                    <dd className="text-sm text-slate-900">{user?.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500 mb-1">Membre depuis</dt>
                    <dd className="text-sm text-slate-900">
                      {user?.createdAt ? formatMemberSince(user.createdAt) : 'N/A'}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Fonctionnalités disponibles */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">
                Fonctionnalités disponibles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* Gestion des créneaux - Active */}
                {user?.role === 'PROVIDER' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Actif
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Gestion des créneaux</h4>
                    <p className="text-sm text-slate-600 mb-4">
                      Créez et gérez vos créneaux horaires pour permettre aux clients de prendre rendez-vous.
                    </p>
                    <Link href="/dashboard/slots">
                      <span className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                        Gérer mes créneaux
                      </span>
                    </Link>
                  </div>
                )}

                {/* Gestion des clients - Bientôt disponible */}
                {user?.role === 'PROVIDER' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 opacity-75">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <UsersIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        Bientôt
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Gestion des clients</h4>
                    <p className="text-sm text-slate-600 mb-4">
                      Consultez et gérez vos clients, leur historique et leurs préférences.
                    </p>
                    <button 
                      disabled 
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-slate-300 text-slate-500 text-sm font-medium rounded-lg cursor-not-allowed"
                    >
                      Bientôt disponible
                    </button>
                  </div>
                )}

                {/* Statistiques - Bientôt disponible */}
                {user?.role === 'PROVIDER' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 opacity-75">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <ChartBarIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        Bientôt
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Statistiques</h4>
                    <p className="text-sm text-slate-600 mb-4">
                      Analysez vos performances et suivez l'évolution de votre activité.
                    </p>
                    <button 
                      disabled 
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-slate-300 text-slate-500 text-sm font-medium rounded-lg cursor-not-allowed"
                    >
                      Bientôt disponible
                    </button>
                  </div>
                )}

                {/* Pour les autres rôles */}
                {user?.role === 'CLIENT' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Actif
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Prise de rendez-vous</h4>
                    <p className="text-sm text-slate-600 mb-4">
                      Consultez les disponibilités et prenez rendez-vous avec un prestataire.
                    </p>
                    <Link href="/dashboard/bookings">
                      <span className="inline-flex items-center justify-center w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                        Prendre rendez-vous
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
