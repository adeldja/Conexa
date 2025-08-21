'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Select, Card } from '@/components/ui';
import { ProviderCard } from '@/components/features';
import { providerProfileService, specialtyService } from '@/services';
import type { ProviderProfile, Specialty } from '@/types/profiles';

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Filtres de recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Charger les spécialités au montage
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const data = await specialtyService.getAll();
        setSpecialties(data);
      } catch (error) {
        console.error('Erreur lors du chargement des spécialités:', error);
      }
    };

    loadSpecialties();
  }, []);

  // Effectuer la recherche
  const performSearch = async (page = 1) => {
    setSearchLoading(true);
    try {
      const response = await providerProfileService.search({
        query: searchQuery || undefined,
        specialtyId: selectedSpecialty || undefined,
        page,
        limit: 12,
      });

      setProviders(response.providers);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setProviders([]);
    } finally {
      setSearchLoading(false);
      setLoading(false);
    }
  };

  // Recherche initiale au montage
  useEffect(() => {
    performSearch();
  }, []);

  // Rechercher quand les filtres changent
  const handleSearch = () => {
    setCurrentPage(1);
    performSearch(1);
  };

  // Changer de page
  const handlePageChange = (page: number) => {
    performSearch(page);
  };

  // Réinitialiser les filtres
  const handleReset = () => {
    setSearchQuery('');
    setSelectedSpecialty('');
    setCurrentPage(1);
    performSearch(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des prestataires...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Trouvez votre prestataire idéal
        </h1>
        <p className="text-gray-600">
          Découvrez des professionnels qualifiés dans votre domaine
        </p>
      </div>

      {/* Filtres de recherche */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Recherche par mot-clé */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <Input
              id="search"
              type="text"
              placeholder="Nom, description, compétences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Filtre par spécialité */}
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
              Spécialité
            </label>
            <Select
              id="specialty"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">Toutes les spécialités</option>
              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.icon} {specialty.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSearch}
              disabled={searchLoading}
              className="flex-1"
            >
              {searchLoading ? 'Recherche...' : 'Rechercher'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={searchLoading}
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Résultats */}
      {searchLoading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Recherche en cours...</p>
          </div>
        </div>
      ) : providers.length > 0 ? (
        <>
          {/* Nombre de résultats */}
          <div className="mb-6">
            <p className="text-gray-600">
              {providers.length} prestataire{providers.length > 1 ? 's' : ''} trouvé{providers.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Grille des prestataires */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {providers.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onViewProfile={(provider) => {
                  // TODO: Navigation vers le profil détaillé
                  console.log('Voir profil:', provider);
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'primary' : 'outline'}
                        onClick={() => handlePageChange(page)}
                        className="w-10 h-10"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <p className="text-lg mb-2">Aucun prestataire trouvé</p>
            <p className="text-sm">
              Essayez de modifier vos critères de recherche ou{' '}
              <button onClick={handleReset} className="text-blue-600 hover:underline">
                réinitialisez les filtres
              </button>
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
