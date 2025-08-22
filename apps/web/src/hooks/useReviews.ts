import { useState, useEffect } from 'react';
import { reviewService } from '@/services/reviewService';
import type { Review } from '@/types/profiles';

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: Array<{ rating: number; count: number }>;
}

interface ReviewFilters {
  rating?: string;
  period?: string;
}

export function useReviews(userId: string | null, isProvider: boolean) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReviewFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);

  const limit = 10;

  const fetchReviews = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        limit: limit,
      };

      if (filters.rating) params.rating = filters.rating;
      if (filters.period) params.period = filters.period;

      const response = isProvider
        ? await reviewService.getByProvider(userId, params)
        : await reviewService.getByClient();

      if (isProvider && response && typeof response === 'object' && 'reviews' in response) {
        setReviews(response.reviews || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalReviews(response.pagination?.total || 0);
      } else {
        setReviews(Array.isArray(response) ? response : []);
        setTotalPages(1);
        setTotalReviews(Array.isArray(response) ? response.length : 0);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des avis:', err);
      setError('Impossible de charger les avis');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!userId || !isProvider) return;

    try {
      const statsData = await reviewService.getProviderStats(userId);
      setStats(statsData);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [userId, currentPage, filters]);

  useEffect(() => {
    if (isProvider) {
      fetchStats();
    }
  }, [userId, isProvider]);

  const applyFilters = () => {
    setCurrentPage(1);
    fetchReviews();
  };

  return {
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
    refetch: fetchReviews,
  };
}
