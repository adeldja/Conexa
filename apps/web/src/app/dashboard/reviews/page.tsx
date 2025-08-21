'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useState, useEffect } from 'react';
import { reviewService } from '@/services/reviewService';
import type { Review } from '@/types/profiles';
import { StarRating, Card, Button, Skeleton } from '@/components/ui';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: Array<{ rating: number; count: number }>;
}

interface ReviewFilters {
  rating?: string;
  period?: string;
}

export default function ReviewsPage() {
  const { user } = useAuth();

  // États pour les données
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReviewFilters>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const limit = 10;

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

  if (!isProvider && !mockUser) {
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

  // Charger les données
  useEffect(() => {
    loadReviewsData();
  }, [currentPage, filters]);

  const loadReviewsData = async () => {
    const currentUser = user || mockUser;
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Charger les statistiques (une seule fois)
      if (!stats) {
        const statsData = await reviewService.getProviderStats(currentUser.id);
        setStats(statsData);
      }

      // Charger les avis avec pagination
      const reviewsData = await reviewService.getByProvider(currentUser.id, {
        page: currentPage,
        limit,
      });

      setReviews(reviewsData.reviews);
      setTotalPages(reviewsData.pagination.totalPages);
      setTotalReviews(reviewsData.pagination.total);
    } catch (err) {
      console.error('Erreur lors du chargement des avis:', err);
      setError('Impossible de charger les avis');
    } finally {
      setLoading(false);
    }
  };

  // Gestion des filtres
  const handleFilterChange = (filterType: keyof ReviewFilters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value || undefined }));
    setCurrentPage(1); // Reset à la première page
  };

  // Appliquer les filtres côté client (en attendant l'implémentation backend)
  const filteredReviews = reviews.filter(review => {
    if (filters.rating && review.rating.toString() !== filters.rating) {
      return false;
    }

    if (filters.period) {
      const reviewDate = new Date(review.createdAt);
      const now = new Date();

      switch (filters.period) {
        case 'week':
          return reviewDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'month':
          return reviewDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case 'quarter':
          return reviewDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        default:
          return true;
      }
    }

    return true;
  });

  // Calculer la distribution des notes pour l'histogramme
  const getRatingDistribution = () => {
    if (!stats) return [];
    const distribution = [5, 4, 3, 2, 1].map(rating => {
      const breakdown = stats.ratingBreakdown.find(item => item.rating === rating);
      return {
        rating,
        count: breakdown?.count || 0,
        percentage:
          stats.totalReviews > 0 ? ((breakdown?.count || 0) / stats.totalReviews) * 100 : 0,
      };
    });
    return distribution;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Avis Reçus</h1>
            <p className="text-gray-600 mt-2">Consultez les évaluations laissées par vos clients</p>
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
              <li className="text-gray-900 font-medium">Avis reçus</li>
            </ol>
          </nav>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="text-3xl text-yellow-500 mr-4">⭐</div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? (
                      <Skeleton className="w-12 h-8" />
                    ) : (
                      stats?.averageRating?.toFixed(1) || '0.0'
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Note moyenne</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="text-3xl text-blue-500 mr-4">💬</div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? <Skeleton className="w-12 h-8" /> : stats?.totalReviews || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total avis</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="text-3xl text-green-500 mr-4">📈</div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? (
                      <Skeleton className="w-12 h-8" />
                    ) : (
                      filteredReviews.filter(r => {
                        const reviewDate = new Date(r.createdAt);
                        const now = new Date();
                        return reviewDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                      }).length
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Ce mois</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="text-3xl text-orange-500 mr-4">🏆</div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? (
                      <Skeleton className="w-12 h-8" />
                    ) : stats ? (
                      Math.round(
                        (stats.ratingBreakdown
                          .filter(r => r.rating >= 4)
                          .reduce((sum, r) => sum + r.count, 0) /
                          stats.totalReviews) *
                          100
                      ) + '%'
                    ) : (
                      '0%'
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Avis positifs</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Distribution des notes */}
          {!loading && stats && stats.totalReviews > 0 && (
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution des notes</h3>
              <div className="space-y-3">
                {getRatingDistribution().map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <span className="text-yellow-500">⭐</span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 w-12 text-right">{count}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Filtres et liste des avis */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Liste des avis</h2>

                {/* Filtres */}
                <div className="flex items-center space-x-4">
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.rating || ''}
                    onChange={e => handleFilterChange('rating', e.target.value)}
                  >
                    <option value="">Toutes les notes</option>
                    <option value="5">5 étoiles</option>
                    <option value="4">4 étoiles</option>
                    <option value="3">3 étoiles</option>
                    <option value="2">2 étoiles</option>
                    <option value="1">1 étoile</option>
                  </select>

                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.period || ''}
                    onChange={e => handleFilterChange('period', e.target.value)}
                  >
                    <option value="">Toutes les périodes</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                    <option value="quarter">Ce trimestre</option>
                  </select>

                  {(filters.rating || filters.period) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFilters({});
                        setCurrentPage(1);
                      }}
                    >
                      Réinitialiser
                    </Button>
                  )}
                </div>
              </div>

              {/* Liste des avis */}
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="w-32 h-4" />
                          <Skeleton className="w-24 h-4" />
                          <Skeleton className="w-full h-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <div className="text-4xl text-gray-400">📝</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {filters.rating || filters.period ? 'Aucun avis trouvé' : "Pas encore d'avis"}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {filters.rating || filters.period
                      ? 'Aucun avis ne correspond aux critères sélectionnés. Essayez de modifier vos filtres.'
                      : "Vous n'avez pas encore reçu d'avis de vos clients. Une fois vos premiers services réalisés, les avis apparaîtront ici."}
                  </p>
                  {(filters.rating || filters.period) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilters({});
                        setCurrentPage(1);
                      }}
                    >
                      Voir tous les avis
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReviews.map(review => (
                    <div
                      key={review.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar du client */}
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          {review.client?.clientProfile?.avatar ? (
                            <img
                              src={review.client.clientProfile.avatar}
                              alt={review.client.fullName || 'Client'}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-blue-600 font-semibold text-sm">
                              {review.client?.fullName?.charAt(0).toUpperCase() || 'C'}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Header de l'avis */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900">
                                {review.client?.fullName || 'Client anonyme'}
                              </span>
                              <StarRating rating={review.rating} size="sm" />
                            </div>
                            <span
                              className="text-sm text-gray-500"
                              title={new Date(review.createdAt).toLocaleString('fr-FR')}
                            >
                              {formatDistanceToNow(new Date(review.createdAt), {
                                locale: fr,
                                addSuffix: true,
                              })}
                            </span>
                          </div>

                          {/* Commentaire */}
                          {review.comment && (
                            <div className="bg-gray-50 rounded-xl p-4 mt-3 border border-gray-100">
                              <p className="text-gray-700 text-sm leading-relaxed italic">
                                "{review.comment}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Affichage de {(currentPage - 1) * limit + 1} à{' '}
                    {Math.min(currentPage * limit, totalReviews)} sur {totalReviews} avis
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>

                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        );
                      })}

                      {totalPages > 5 && (
                        <>
                          {totalPages > 6 && <span className="text-gray-500">...</span>}
                          <Button
                            variant={currentPage === totalPages ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            className="w-8 h-8 p-0"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
