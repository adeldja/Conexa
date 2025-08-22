import { StarRating } from '@/components/ui';

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: Array<{ rating: number; count: number }>;
}

interface ReviewStatsCardProps {
  stats: ReviewStats | null;
  loading: boolean;
}

export default function ReviewStatsCard({ stats, loading }: ReviewStatsCardProps) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques des avis</h3>

      <div className="flex items-center mb-4">
        <div className="text-3xl font-bold text-gray-900 mr-2">
          {stats.averageRating.toFixed(1)}
        </div>
        <div>
          <StarRating rating={stats.averageRating} size="lg" />
          <p className="text-sm text-gray-600 mt-1">{stats.totalReviews} avis au total</p>
        </div>
      </div>

      <div className="space-y-2">
        {stats.ratingBreakdown.map(item => (
          <div key={item.rating} className="flex items-center">
            <span className="text-sm text-gray-600 w-8">{item.rating}★</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{
                  width: `${stats.totalReviews > 0 ? (item.count / stats.totalReviews) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 w-8">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
