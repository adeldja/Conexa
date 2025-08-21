'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { ToastContainer, useToast, Skeleton } from '@/components/ui';
import {
  MySpecialtiesSection,
  AvailableSpecialtiesSection,
} from '@/components/features/specialties';
import { useSpecialties } from '@/hooks/useSpecialties';

export default function SpecialtiesPage() {
  const { user } = useAuth();
  const { toasts, removeToast } = useToast();

  const {
    mySpecialties,
    availableSpecialties,
    loading,
    searchQuery,
    processingIds,
    setSearchQuery,
    handleAddSpecialty,
    handleRemoveSpecialty,
    handleLevelChange,
  } = useSpecialties();

  // Vérifier si l'utilisateur est un provider
  const isProvider = user?.role === 'PROVIDER';

  if (!isProvider) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Accès réservé aux prestataires
              </h2>
              <p className="text-gray-600 mb-6">
                Cette section est uniquement accessible aux utilisateurs avec le rôle "PROVIDER".
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retour au dashboard
              </a>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <ToastContainer toasts={toasts} onRemove={removeToast} />

        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mes Spécialités</h1>
            <p className="text-gray-600 mt-2">Gérez vos compétences et domaines d'expertise</p>
          </div>

          {/* Navigation breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <a href="/dashboard" className="text-blue-600 hover:text-blue-800">
                  Dashboard
                </a>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-900 font-medium">Spécialités</li>
            </ol>
          </nav>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="h-96 w-full rounded-lg" />
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mes spécialités */}
              <MySpecialtiesSection
                mySpecialties={mySpecialties}
                processingIds={processingIds}
                onRemove={handleRemoveSpecialty}
                onLevelChange={handleLevelChange}
              />

              {/* Spécialités disponibles */}
              <AvailableSpecialtiesSection
                availableSpecialties={availableSpecialties}
                processingIds={processingIds}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAdd={handleAddSpecialty}
              />
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
