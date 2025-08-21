import { SpecialtyCard } from '@/components/features';
import { Card } from '@/components/ui';
import type { ProviderSpecialty } from '@/types/profiles';

interface MySpecialtiesSectionProps {
  mySpecialties: ProviderSpecialty[];
  processingIds: Set<string>;
  onRemove: (specialtyId: string) => void;
  onLevelChange: (specialtyId: string, level: number) => void;
}

export function MySpecialtiesSection({
  mySpecialties,
  processingIds,
  onRemove,
  onLevelChange,
}: MySpecialtiesSectionProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Mes spécialités ({mySpecialties.length})
          </h2>
          <div className="text-sm text-gray-500">
            {mySpecialties.length === 0 
              ? 'Aucune spécialité configurée'
              : 'Cliquez pour modifier le niveau'
            }
          </div>
        </div>

        {mySpecialties.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune spécialité configurée
            </h3>
            <p className="text-sm">
              Ajoutez vos compétences depuis le catalogue pour attirer les bons clients.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mySpecialties
              .sort((a, b) => {
                // Trier par niveau (Expert en premier)
                const levelOrder = { 'Expert': 5, 'Avancé': 4, 'Confirmé': 3, 'Intermédiaire': 2, 'Débutant': 1 };
                return (levelOrder[b.level || 'Intermédiaire'] || 0) - (levelOrder[a.level || 'Intermédiaire'] || 0);
              })
              .map((providerSpecialty, index) => {
                const isProcessing = processingIds.has(providerSpecialty.specialtyId);
                // Clé unique garantie avec plusieurs éléments
                const uniqueKey = `my-${providerSpecialty.id}-${providerSpecialty.specialtyId}-${index}-${providerSpecialty.createdAt}`;
                
                return (
                  <SpecialtyCard
                    key={uniqueKey}
                    specialty={providerSpecialty.specialty}
                    isAdded={true}
                    providerSpecialty={providerSpecialty}
                    onRemove={onRemove}
                    onLevelChange={onLevelChange}
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
