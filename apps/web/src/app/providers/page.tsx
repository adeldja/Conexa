'use client';

import { useState, useEffect } from 'react';
import { providerProfileService, specialtyService } from '@/services';
import type { ProviderProfile, Specialty } from '@/types/profiles';
import SearchFilters from './components/SearchFilters';
import ProvidersGrid from './components/ProvidersGrid';
import Pagination from './components/Pagination';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trouvez votre prestataire idéal</h1>
        <p className="text-gray-600">Découvrez des professionnels qualifiés dans votre domaine</p>
      </div>

      {/* Filtres de recherche */}
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        specialties={specialties}
        onSearch={handleSearch}
        onReset={handleReset}
        searchLoading={searchLoading}
      />

      {/* Grille des prestataires */}
      <ProvidersGrid providers={providers} loading={searchLoading} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={searchLoading}
      />
    </div>
  );
}
