import type { ProviderProfile, Specialty } from '@/types/profiles';

export interface SearchParams {
  query: string;
  specialtyId: string;
  page: number;
  limit: number;
}

export function useProvidersSearch() {
  const performSearch = async (params: Partial<SearchParams>) => {
    // Cette fonction sera utilisée par le composant parent
    // pour effectuer la recherche avec les services
    return {
      providers: [] as ProviderProfile[],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 1,
      },
    };
  };

  return { performSearch };
}

export function resetSearchFilters() {
  return {
    searchQuery: '',
    selectedSpecialty: '',
    currentPage: 1,
  };
}
