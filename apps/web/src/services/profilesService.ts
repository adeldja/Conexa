import { api } from '@/apiConfig';
import type {
  ClientProfile,
  ProviderProfile,
  CreateClientProfileRequest,
  UpdateClientProfileRequest,
  CreateProviderProfileRequest,
  UpdateProviderProfileRequest,
} from '@/types/profiles';

export interface SearchProvidersParams {
  query?: string;
  specialtyId?: string;
  page?: number;
  limit?: number;
}

export interface SearchProvidersResponse {
  providers: ProviderProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const profilesService = {
  // === CLIENT PROFILES ===
  async createClientProfile(data: CreateClientProfileRequest): Promise<ClientProfile> {
    const response = await api.post('/profiles/client', data);
    return response.data;
  },

  async getClientProfile(userId: string): Promise<ClientProfile> {
    const response = await api.get(`/profiles/client/${userId}`);
    return response.data;
  },

  async updateClientProfile(
    userId: string,
    data: UpdateClientProfileRequest
  ): Promise<ClientProfile> {
    const response = await api.put(`/profiles/client/${userId}`, data);
    return response.data;
  },

  // === PROVIDER PROFILES ===
  async createProviderProfile(data: CreateProviderProfileRequest): Promise<ProviderProfile> {
    const response = await api.post('/profiles/provider', data);
    return response.data;
  },

  async getProviderProfile(userId: string): Promise<ProviderProfile> {
    const response = await api.get(`/profiles/provider/${userId}`);
    return response.data;
  },

  async updateProviderProfile(
    userId: string,
    data: UpdateProviderProfileRequest
  ): Promise<ProviderProfile> {
    const response = await api.put(`/profiles/provider/${userId}`, data);
    return response.data;
  },

  // === SEARCH PROVIDERS ===
  async searchProviders(params: SearchProvidersParams = {}): Promise<SearchProvidersResponse> {
    const searchParams = new URLSearchParams();

    if (params.query) searchParams.append('query', params.query);
    if (params.specialtyId) searchParams.append('specialtyId', params.specialtyId);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await api.get(`/profiles/providers/search?${searchParams.toString()}`);
    return response.data;
  },
};
