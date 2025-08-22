'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Header from '@/components/layout/Header';
import ReviewStatsCard from '@/components/features/reviews/ReviewStatsCard';
import ReviewFilters from '@/components/features/reviews/ReviewFilters';
import ReviewList from '@/components/features/reviews/ReviewList';
import ReviewPagination from '@/components/features/reviews/ReviewPagination';
import { useReviews } from '@/hooks/useReviews';

export default function ReviewsPage() {
  const { user, logout } = useAuth();

  // Vérifier si l'utilisateur est un provider
  const isProvider = user?.role === 'PROVIDER';

  // Pour les tests: utiliser des données mock si pas d'utilisateur connecté
  const mockUser = !user
    ? {
        id: '59ebe6a2-6d07-4cb6-af9e-c8b153b70f3f',
        role: 'PROVIDER' as const,
        email: 'test@provider.com',
      }
    : null;

  const currentUser = user || mockUser;
  const userId = currentUser?.id || null;

  const {
    reviews,
    stats,
    loading,
    error,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    totalReviews,
    limit,
    applyFilters,
  } = useReviews(userId, isProvider);

  if (!isProvider && !mockUser) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header user={user} onLogout={logout} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Accès non autorisé</h2>
              <p className="text-gray-600">Cette page est réservée aux prestataires de services.</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onLogout={logout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Mes avis clients</h1>
            <p className="text-gray-600 mt-2">Consultez et analysez les retours de vos clients</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ReviewStatsCard stats={stats} loading={loading} />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <ReviewFilters
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={applyFilters}
              />

              <ReviewList reviews={reviews} loading={loading} />

              <ReviewPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalReviews={totalReviews}
                limit={limit}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
