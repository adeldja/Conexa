import { Card, Badge, StarRating } from '@/components/ui';
import type { ProviderProfile } from '@/types/profiles';

interface ProviderInfoCardProps {
  provider: ProviderProfile;
}

export default function ProviderInfoCard({ provider }: ProviderInfoCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start space-x-6">
        {/* Avatar */}
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl font-bold">
            {provider.businessName?.charAt(0) || 'P'}
          </span>
        </div>

        {/* Informations principales */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {provider.businessName || 'Prestataire'}
              </h1>
              {provider.averageRating && (
                <div className="flex items-center mt-1">
                  <StarRating rating={provider.averageRating} size="sm" />
                  <span className="ml-2 text-sm text-gray-600">
                    ({provider.averageRating.toFixed(1)})
                  </span>
                </div>
              )}
            </div>
            <Badge variant="success">Prestataire vérifié</Badge>
          </div>

          {/* Spécialités */}
          {provider.specialties && provider.specialties.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Spécialités</h3>
              <div className="flex flex-wrap gap-2">
                {provider.specialties.map(specialty => (
                  <Badge key={specialty.id} variant="outline">
                    {specialty.specialty.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Informations de contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {provider.address && (
              <div>
                <span className="font-medium text-gray-700">Adresse :</span>
                <span className="ml-2 text-gray-600">{provider.address}</span>
              </div>
            )}
            {provider.defaultPrice && (
              <div>
                <span className="font-medium text-gray-700">Tarif :</span>
                <span className="ml-2 text-gray-600">
                  {provider.defaultPrice} {provider.currency}
                </span>
              </div>
            )}
            {provider.phone && (
              <div>
                <span className="font-medium text-gray-700">Téléphone :</span>
                <span className="ml-2 text-gray-600">{provider.phone}</span>
              </div>
            )}
            {provider.website && (
              <div>
                <span className="font-medium text-gray-700">Site web :</span>
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  {provider.website}
                </a>
              </div>
            )}
          </div>

          {/* Description */}
          {provider.description && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">À propos</h3>
              <p className="text-gray-600 leading-relaxed">{provider.description}</p>
            </div>
          )}

          {/* Statistiques */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-lg font-semibold text-gray-900">{provider.totalSlots}</div>
              <div className="text-xs text-gray-600">Créneaux</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-lg font-semibold text-gray-900">{provider.totalBookings}</div>
              <div className="text-xs text-gray-600">Réservations</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-lg font-semibold text-gray-900">
                {provider.averageRating ? provider.averageRating.toFixed(1) : '-'}
              </div>
              <div className="text-xs text-gray-600">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
