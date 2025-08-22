import { StarRating, Card } from '@/components/ui';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Review } from '@/types/profiles';

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
}

export default function ReviewList({ reviews, loading }: ReviewListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">
          <p className="text-lg font-medium mb-2">Aucun avis trouvé</p>
          <p>Il n'y a pas encore d'avis correspondant à vos critères.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <Card key={review.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-medium text-sm">
                  {review.client?.fullName?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {review.client?.fullName || 'Utilisateur anonyme'}
                </p>
                <div className="flex items-center mt-1">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="ml-2 text-sm text-gray-500">
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {review.comment && <p className="text-gray-700 leading-relaxed">{review.comment}</p>}
        </Card>
      ))}
    </div>
  );
}
