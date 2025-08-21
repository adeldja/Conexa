import { SpecialtyCard } from '@/components/features';
import { Card, Input } from '@/components/ui';
import type { Specialty } from '@/types/profiles';

interface AvailableSpecialtiesSectionProps {
  availableSpecialties: Specialty[];
  processingIds: Set<string>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAdd: (specialty: Specialty) => void;
}

export function AvailableSpecialtiesSection({
  availableSpecialties,
  processingIds,
  searchQuery,
  onSearchChange,
  onAdd,
}: AvailableSpecialtiesSectionProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Spécialités disponibles</h2>

          {/* Recherche */}
          <Input
            type="text"
            placeholder="Rechercher une spécialité..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        {availableSpecialties.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">{searchQuery ? '🔍' : '✅'}</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'Aucun résultat trouvé' : 'Toutes les spécialités ajoutées'}
            </h3>
            <p className="text-sm">
              {searchQuery
                ? 'Essayez un autre terme de recherche'
                : 'Vous avez ajouté toutes les spécialités disponibles'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {availableSpecialties.map((specialty, index) => {
              const isProcessing = processingIds.has(specialty.id);
              // Clé unique avec plusieurs identifiants
              const uniqueKey = `available-${specialty.id}-${index}-${specialty.createdAt || 'no-date'}`;

              return (
                <SpecialtyCard
                  key={uniqueKey}
                  specialty={specialty}
                  isAdded={false}
                  onAdd={onAdd}
                  loading={isProcessing}
                />
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
