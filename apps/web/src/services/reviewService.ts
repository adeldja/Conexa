import { api, API_CONFIG } from '@/apiConfig';
import type { Review, CreateReviewRequest } from '@/types/profiles';

// === AVIS ===

export const reviewService = {
  // Créer un avis
  async create(data: CreateReviewRequest): Promise<Review> {
    const response = await api.post(API_CONFIG.ENDPOINTS.REVIEWS, data);
    return response.data;
  },

  // Récupérer tous les avis
  async getAll(): Promise<Review[]> {
    const response = await api.get(API_CONFIG.ENDPOINTS.REVIEWS);
    return response.data;
  },

  // Récupérer les avis d'un prestataire avec pagination
  async getByProvider(
    providerId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<{
    reviews: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await api.get(
      `${API_CONFIG.ENDPOINTS.REVIEWS}/provider/${providerId}?${searchParams}`
    );
    return response.data;
  },

  // Récupérer les avis d'un client
  async getByClient(): Promise<Review[]> {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.REVIEWS}/client/my-reviews`);
    return response.data;
  },

  // Récupérer les statistiques d'avis d'un prestataire
  async getProviderStats(providerId: string): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingBreakdown: Array<{ rating: number; count: number }>;
  }> {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.REVIEWS}/provider/${providerId}/stats`);
    return response.data;
  },

  // Récupérer un avis par ID
  async get(id: string): Promise<Review> {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.REVIEWS}/${id}`);
    return response.data;
  },

  // Mettre à jour un avis
  async update(id: string, data: Partial<CreateReviewRequest>): Promise<Review> {
    const response = await api.put(`${API_CONFIG.ENDPOINTS.REVIEWS}/${id}`, data);
    return response.data;
  },

  // Supprimer un avis
  async delete(id: string): Promise<void> {
    await api.delete(`${API_CONFIG.ENDPOINTS.REVIEWS}/${id}`);
  },
};
