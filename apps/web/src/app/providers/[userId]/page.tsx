'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, Badge, Button, StarRating } from '@/components/ui';
import { providerProfileService, reviewService } from '@/services';
import type { ProviderProfile, Review } from '@/types/profiles';

export default function ProviderProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<{
    totalReviews: number;
    averageRating: number;
    ratingBreakdown: Array<{ rating: number; count: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProviderData = async () => {
      try {
        setLoading(true);

        // Charger le profil du prestataire
        const providerData = await providerProfileService.get(userId);
        setProvider(providerData);

        // Charger les avis et statistiques
        const [reviewsResponse, statsData] = await Promise.all([
          reviewService.getByProvider(userId, { limit: 10 }),
          reviewService.getProviderStats(userId),
        ]);

        setReviews(reviewsResponse.reviews);
        setReviewStats(statsData);
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err);
        setError('Impossible de charger le profil du prestataire');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadProviderData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du profil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Profil non trouvé</h1>
          <p className="text-gray-600 mb-4">
            {error || "Ce prestataire n'existe pas ou n'est plus disponible."}
          </p>
          <Button onClick={() => window.history.back()}>Retour</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête du profil */}
      <Card className="p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar et infos principales */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {provider.avatar ? (
                <img
                  src={provider.avatar}
                  alt={provider.businessName || provider.user?.fullName || 'Provider'}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <span className="text-blue-600 font-bold text-4xl">
                  {(provider.businessName || provider.user?.fullName || 'P')[0].toUpperCase()}
                </span>
              )}
            </div>

            {provider.isVerified && (
              <Badge variant="success" className="mb-2">
                ✓ Prestataire vérifié
              </Badge>
            )}
          </div>

          {/* Informations détaillées */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {provider.businessName || provider.user?.fullName}
                </h1>

                {/* Note et avis */}
                {reviewStats && reviewStats.totalReviews > 0 && (
                  <div className="flex items-center gap-4 mb-4">
                    <StarRating rating={reviewStats.averageRating} size="lg" />
                    <span className="text-gray-600">{reviewStats.totalReviews} avis</span>
                  </div>
                )}
              </div>

              {/* Prix */}
              {provider.defaultPrice && (
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{provider.defaultPrice}€</div>
                  <div className="text-gray-600">par session</div>
                </div>
              )}
            </div>

            {/* Description */}
            {provider.description && (
              <p className="text-gray-700 mb-6 leading-relaxed">{provider.description}</p>
            )}

            {/* Spécialités */}
            {provider.specialties && provider.specialties.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Spécialités</h3>
                <div className="flex flex-wrap gap-3">
                  {provider.specialties.map(providerSpecialty => (
                    <Badge key={providerSpecialty.id} variant="primary" size="lg">
                      {providerSpecialty.specialty.icon} {providerSpecialty.specialty.name}
                      {providerSpecialty.level && (
                        <span className="ml-2 font-semibold">({providerSpecialty.level})</span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Informations de contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {provider.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📞</span>
                  <span>{provider.phone}</span>
                </div>
              )}
              {provider.website && (
                <div className="flex items-center gap-2">
                  <span>🌐</span>
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Site web
                  </a>
                </div>
              )}
              {provider.address && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📍</span>
                  <span>{provider.address}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button size="lg" className="flex-1 md:flex-none">
                Réserver une session
              </Button>
              <Button variant="outline" size="lg">
                Envoyer un message
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Avis clients */}
      {reviews.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Avis clients ({reviewStats?.totalReviews})
          </h2>

          {/* Répartition des notes */}
          {reviewStats && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {reviewStats.averageRating.toFixed(1)}
                  </div>
                  <StarRating rating={reviewStats.averageRating} size="lg" />
                  <div className="text-gray-600 mt-2">
                    Note moyenne sur {reviewStats.totalReviews} avis
                  </div>
                </div>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count =
                      reviewStats.ratingBreakdown.find(r => r.rating === rating)?.count || 0;
                    const percentage =
                      reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;

                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="w-3 text-sm">{rating}</span>
                        <span className="text-yellow-400">★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Liste des avis */}
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {(review.client?.fullName || 'A')[0].toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {review.client?.fullName || 'Client anonyme'}
                      </span>
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    {review.comment && (
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
