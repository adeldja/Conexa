'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, Button } from '@/components/ui';
import { useProviderProfile } from '@/hooks/useProviderProfile';
import ProviderInfoCard from '@/components/features/providers/ProviderInfoCard';
import ProviderReviewsSection from '@/components/features/providers/ProviderReviewsSection';

export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const { provider, reviews, reviewStats, loading, error } = useProviderProfile(userId);

  const handleViewAllReviews = () => {
    router.push(`/providers/${userId}/reviews`);
  };

  const handleBookAppointment = () => {
    router.push(`/providers/${userId}/booking`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="bg-white rounded-lg h-64"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg h-96"></div>
              <div className="bg-white rounded-lg h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Prestataire introuvable</h2>
            <p className="text-gray-600 mb-6">
              {error || "Le prestataire que vous recherchez n'existe pas ou n'est plus disponible."}
            </p>
            <Button onClick={() => router.push('/providers')}>
              Retour à la liste des prestataires
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bouton retour */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/providers')}
            className="flex items-center"
          >
            ← Retour à la liste
          </Button>
        </div>

        {/* Profil du prestataire */}
        <div className="mb-6">
          <ProviderInfoCard provider={provider} />
        </div>

        {/* Actions rapides */}
        <div className="mb-6">
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleBookAppointment} className="flex-1">
                Prendre rendez-vous
              </Button>
              <Button variant="outline" onClick={handleViewAllReviews} className="flex-1">
                Voir tous les avis
              </Button>
            </div>
          </Card>
        </div>

        {/* Section avis */}
        <ProviderReviewsSection
          reviews={reviews}
          reviewStats={reviewStats}
          onViewAllReviews={handleViewAllReviews}
        />
      </div>
    </div>
  );
}
