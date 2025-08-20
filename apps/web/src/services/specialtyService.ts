import { api, API_CONFIG } from '@/apiConfig';
import type {
  Specialty,
  ProviderSpecialty,
  CreateSpecialtyRequest,
  AddProviderSpecialtyRequest,
} from '@/types/profiles';

// === SPECIALITES ===

export const specialtyService = {
  // Créer une spécialité
  async create(data: CreateSpecialtyRequest): Promise<Specialty> {
    const response = await api.post(API_CONFIG.ENDPOINTS.SPECIALTIES, data);
    return response.data;
  },

  // Lister toutes les spécialités
  async getAll(): Promise<(Specialty & { _count: { providers: number } })[]> {
    const response = await api.get(API_CONFIG.ENDPOINTS.SPECIALTIES);
    return response.data;
  },

  // Récupérer une spécialité par ID
  async get(id: string): Promise<Specialty> {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.SPECIALTIES}/${id}`);
    return response.data;
  },

  // Mettre à jour une spécialité
  async update(id: string, data: Partial<CreateSpecialtyRequest>): Promise<Specialty> {
    const response = await api.put(`${API_CONFIG.ENDPOINTS.SPECIALTIES}/${id}`, data);
    return response.data;
  },

  // Supprimer une spécialité
  async delete(id: string): Promise<void> {
    await api.delete(`${API_CONFIG.ENDPOINTS.SPECIALTIES}/${id}`);
  },

  // === SPECIALITES PRESTATAIRE ===

  // Ajouter une spécialité à un prestataire
  async addToProvider(providerId: string, data: AddProviderSpecialtyRequest): Promise<ProviderSpecialty> {
    const response = await api.post(`${API_CONFIG.ENDPOINTS.SPECIALTIES}/provider/${providerId}`, {
      ...data,
      userId: providerId // Ajouter l'userId pour l'autorisation temporaire
    });
    return response.data;
  },

  // Supprimer une spécialité d'un prestataire
  async removeFromProvider(providerId: string, specialtyId: string): Promise<void> {
    await api.delete(`${API_CONFIG.ENDPOINTS.SPECIALTIES}/provider/${providerId}/${specialtyId}`, {
      data: { userId: providerId } // Ajouter l'userId pour l'autorisation temporaire
    });
  },

  // Récupérer les spécialités d'un prestataire
  async getProviderSpecialties(providerId: string): Promise<ProviderSpecialty[]> {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.SPECIALTIES}/provider/${providerId}`);
    return response.data;
  },
};
