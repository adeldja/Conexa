import { Card, StarRating, Button } from '@/components/ui';
import type { Review } from '@/types/profiles';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProviderReviewsSectionProps {
  reviews: Review[];
  reviewStats: {
    totalReviews: number;
    averageRating: number;
    ratingBreakdown: Array<{ rating: number; count: number }>;
  } | null;
  onViewAllReviews: () => void;
}

export default function ProviderReviewsSection({
  reviews,
  reviewStats,
  onViewAllReviews,
}: ProviderReviewsSectionProps) {
  if (!reviewStats || reviews.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Avis clients</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun avis pour le moment.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Avis clients</h2>
        <Button variant="outline" size="sm" onClick={onViewAllReviews}>
          Voir tous les avis ({reviewStats.totalReviews})
        </Button>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {reviewStats.averageRating.toFixed(1)}
          </div>
          <StarRating rating={reviewStats.averageRating} size="lg" />
          <p className="text-sm text-gray-600 mt-2">Basé sur {reviewStats.totalReviews} avis</p>
        </div>

        <div className="space-y-2">
          {reviewStats.ratingBreakdown.map(item => (
            <div key={item.rating} className="flex items-center">
              <span className="text-sm text-gray-600 w-8">{item.rating}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{
                    width: `${reviewStats.totalReviews > 0 ? (item.count / reviewStats.totalReviews) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-8">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Derniers avis */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Derniers avis</h3>
        {reviews.slice(0, 3).map(review => (
          <div key={review.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-medium">
                    {review.client?.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {review.client?.fullName || 'Utilisateur anonyme'}
                  </p>
                  <div className="flex items-center mt-1">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="ml-2 text-xs text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {review.comment && (
              <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
