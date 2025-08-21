import { Button, Badge } from '@/components/ui';
import { SkillLevelSlider } from '@/components/ui/Slider';
import type { Specialty, ProviderSpecialty } from '@/types/profiles';

interface SpecialtyCardProps {
  specialty: Specialty;
  isAdded?: boolean;
  providerSpecialty?: ProviderSpecialty;
  onAdd?: (specialty: Specialty) => void;
  onRemove?: (specialtyId: string) => void;
  onLevelChange?: (specialtyId: string, level: number) => void;
  loading?: boolean;
}

export function SpecialtyCard({
  specialty,
  isAdded = false,
  providerSpecialty,
  onAdd,
  onRemove,
  onLevelChange,
  loading = false,
}: SpecialtyCardProps) {
  const currentLevel = providerSpecialty?.level || 'Intermédiaire';
  const levelNumber = getLevelNumber(currentLevel);

  function getLevelNumber(level: string): number {
    const levelMap: Record<string, number> = {
      'Débutant': 1,
      'Intermédiaire': 2,
      'Confirmé': 3,
      'Avancé': 4,
      'Expert': 5,
    };
    return levelMap[level] || 3;
  }

  function getLevelString(level: number): 'Débutant' | 'Intermédiaire' | 'Confirmé' | 'Avancé' | 'Expert' {
    const levelMap: Record<number, 'Débutant' | 'Intermédiaire' | 'Confirmé' | 'Avancé' | 'Expert'> = {
      1: 'Débutant',
      2: 'Intermédiaire',
      3: 'Confirmé',
      4: 'Avancé',
      5: 'Expert',
    };
    return levelMap[level] || 'Intermédiaire';
  }

  const handleLevelChange = (newLevel: number) => {
    if (onLevelChange && isAdded) {
      onLevelChange(specialty.id, newLevel);
    }
  };

  return (
    <div className={`
      bg-white rounded-lg border-2 transition-all duration-200 p-4
      ${isAdded 
        ? 'border-blue-200 bg-blue-50/50 shadow-sm' 
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }
      ${loading ? 'opacity-50 pointer-events-none' : ''}
    `}>
      {/* Header avec icône et nom */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {specialty.icon || '🔧'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {specialty.name}
            </h3>
            {specialty.description && (
              <p className="text-sm text-gray-500 mt-1">
                {specialty.description}
              </p>
            )}
          </div>
        </div>

        {/* Badge de statut */}
        {isAdded && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Ajoutée
          </Badge>
        )}
      </div>

      {/* Niveau et certification (si ajoutée) */}
      {isAdded && providerSpecialty && (
        <div className="mb-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau de compétence
            </label>
            <SkillLevelSlider
              value={levelNumber}
              onChange={handleLevelChange}
              disabled={loading}
            />
          </div>

          {providerSpecialty.certification && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certification
              </label>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {providerSpecialty.certification}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {isAdded ? (
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-500">
              Ajoutée le {new Date(providerSpecialty?.createdAt || '').toLocaleDateString('fr-FR')}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove?.(specialty.id)}
              disabled={loading}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Retirer
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-500">
              Cliquez pour ajouter à vos spécialités
            </div>
            <Button
              size="sm"
              onClick={() => onAdd?.(specialty)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Ajouter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant pour afficher une spécialité en mode compact (pour les listes)
interface SpecialtyBadgeProps {
  providerSpecialty: ProviderSpecialty;
  onRemove?: (specialtyId: string) => void;
  showLevel?: boolean;
  className?: string;
}

export function SpecialtyBadge({ 
  providerSpecialty, 
  onRemove, 
  showLevel = true,
  className = '' 
}: SpecialtyBadgeProps) {
  const getLevelColor = (level: string) => {
    const colors = {
      'Débutant': 'bg-red-100 text-red-800',
      'Intermédiaire': 'bg-orange-100 text-orange-800',
      'Confirmé': 'bg-yellow-100 text-yellow-800',
      'Avancé': 'bg-blue-100 text-blue-800',
      'Expert': 'bg-green-100 text-green-800',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white
      ${className}
    `}>
      <span className="text-lg">
        {providerSpecialty.specialty.icon || '🔧'}
      </span>
      <span className="font-medium text-gray-900">
        {providerSpecialty.specialty.name}
      </span>
      {showLevel && providerSpecialty.level && (
        <Badge 
          variant="secondary" 
          className={`text-xs ${getLevelColor(providerSpecialty.level)}`}
        >
          {providerSpecialty.level}
        </Badge>
      )}
      {onRemove && (
        <button
          onClick={() => onRemove(providerSpecialty.specialtyId)}
          className="ml-1 text-gray-400 hover:text-red-500 text-sm"
        >
          ×
        </button>
      )}
    </div>
  );
}
