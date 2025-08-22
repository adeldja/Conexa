import { useState, useEffect } from 'react';
import { providerProfileService, reviewService } from '@/services';
import type { ProviderProfile, Review } from '@/types/profiles';

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: Array<{ rating: number; count: number }>;
}

export function useProviderProfile(userId: string) {
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProviderData = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

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

    loadProviderData();
  }, [userId]);

  return {
    provider,
    reviews,
    reviewStats,
    loading,
    error,
  };
}
