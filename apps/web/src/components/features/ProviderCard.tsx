import { Card } from '@/components/ui/Card';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import type { ProviderProfile } from '@/types/profiles';

interface ProviderCardProps {
  provider: ProviderProfile;
  onViewProfile?: (provider: ProviderProfile) => void;
  className?: string;
}

export function ProviderCard({ provider, onViewProfile, className }: ProviderCardProps) {
  const { user, businessName, description, averageRating, defaultPrice, specialties, isVerified } = provider;

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${className}`}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {provider.avatar ? (
              <img
                src={provider.avatar}
                alt={businessName || user?.fullName || 'Provider'}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-blue-600 font-medium text-lg">
                {(businessName || user?.fullName || 'P')[0].toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {businessName || user?.fullName}
                {isVerified && (
                  <span className="ml-2 text-green-500" title="Prestataire vérifié">
                    ✓
                  </span>
                )}
              </h3>
              
              {/* Note et avis */}
              {averageRating && (
                <div className="flex items-center mb-2">
                  <StarRating rating={averageRating} size="sm" />
                  <span className="ml-2 text-sm text-gray-500">
                    ({provider.totalBookings} réservation{provider.totalBookings > 1 ? 's' : ''})
                  </span>
                </div>
              )}
            </div>

            {/* Prix */}
            {defaultPrice && (
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {defaultPrice}€
                </div>
                <div className="text-sm text-gray-500">
                  / session
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {/* Spécialités */}
          {specialties && specialties.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {specialties.slice(0, 3).map((providerSpecialty) => (
                <Badge key={providerSpecialty.id} variant="secondary" className="text-xs">
                  {providerSpecialty.specialty.icon} {providerSpecialty.specialty.name}
                  {providerSpecialty.level && (
                    <span className="ml-1 font-medium">({providerSpecialty.level})</span>
                  )}
                </Badge>
              ))}
              {specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{specialties.length - 3} autres
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {provider.address && (
                <span className="flex items-center gap-1">
                  📍 {provider.address.split(',')[0]}
                </span>
              )}
              {provider.website && (
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  🌐 Site web
                </a>
              )}
            </div>

            <button
              onClick={() => onViewProfile?.(provider)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voir le profil
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
