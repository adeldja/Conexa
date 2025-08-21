import { api, API_CONFIG } from '@/apiConfig';
import type {
  ClientProfile,
  ProviderProfile,
  CreateClientProfileRequest,
  UpdateClientProfileRequest,
  CreateProviderProfileRequest,
  UpdateProviderProfileRequest,
} from '@/types/profiles';

// === PROFILS CLIENT ===

export const clientProfileService = {
  // Créer un profil client
  async create(data: CreateClientProfileRequest): Promise<ClientProfile> {
    const response = await api.post(`${API_CONFIG.ENDPOINTS.PROFILES}/client`, data);
    return response.data;
  },

  // Récupérer un profil client
  async get(userId: string): Promise<ClientProfile> {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.PROFILES}/client/${userId}`);
    return response.data;
  },

  // Mettre à jour un profil client
  async update(userId: string, data: UpdateClientProfileRequest): Promise<ClientProfile> {
    const response = await api.put(`${API_CONFIG.ENDPOINTS.PROFILES}/client/${userId}`, data);
    return response.data;
  },
};

// === PROFILS PRESTATAIRE ===

export const providerProfileService = {
  // Créer un profil prestataire
  async create(data: CreateProviderProfileRequest): Promise<ProviderProfile> {
    const response = await api.post(`${API_CONFIG.ENDPOINTS.PROFILES}/provider`, data);
    return response.data;
  },

  // Récupérer un profil prestataire
  async get(userId: string): Promise<ProviderProfile> {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.PROFILES}/provider/${userId}`);
    return response.data;
  },

  // Mettre à jour un profil prestataire
  async update(userId: string, data: UpdateProviderProfileRequest): Promise<ProviderProfile> {
    const response = await api.put(`${API_CONFIG.ENDPOINTS.PROFILES}/provider/${userId}`, data);
    return response.data;
  },

  // Rechercher des prestataires
  async search(params: {
    query?: string;
    specialtyId?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    providers: ProviderProfile[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const searchParams = new URLSearchParams();
    
    if (params.query) searchParams.append('query', params.query);
    if (params.specialtyId) searchParams.append('specialtyId', params.specialtyId);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await api.get(`${API_CONFIG.ENDPOINTS.PROFILES}/providers/search?${searchParams}`);
    return response.data;
  },
};
