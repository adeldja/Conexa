import { Input, Button, Select, Card } from '@/components/ui';
import type { Specialty } from '@/types/profiles';

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (specialty: string) => void;
  specialties: Specialty[];
  onSearch: () => void;
  onReset: () => void;
  searchLoading: boolean;
}

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  selectedSpecialty,
  setSelectedSpecialty,
  specialties,
  onSearch,
  onReset,
  searchLoading,
}: SearchFiltersProps) {
  return (
    <Card className="mb-8 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Rechercher un professionnel</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Nom ou service
          </label>
          <Input
            id="search"
            type="text"
            placeholder="Ex: Dr. Martin, kinésithérapeute..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
          />
        </div>

        <div>
          <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
            Spécialité
          </label>
          <Select
            id="specialty"
            value={selectedSpecialty}
            onChange={e => setSelectedSpecialty(e.target.value)}
          >
            <option value="">Toutes les spécialités</option>
            {specialties.map(specialty => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-end space-x-2">
          <Button onClick={onSearch} disabled={searchLoading} className="flex-1" variant="primary">
            {searchLoading ? 'Recherche...' : 'Rechercher'}
          </Button>
          <Button onClick={onReset} variant="outline">
            Réinitialiser
          </Button>
        </div>
      </div>
    </Card>
  );
}
