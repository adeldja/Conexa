import { api, API_CONFIG } from '@/apiConfig';

export interface SeederResult {
  message: string | string[];
  count?: number;
}

class SeederService {
  // Créer les spécialités de base
  async seedSpecialties(): Promise<SeederResult> {
    const response = await api.post(`${API_CONFIG.BASE_URL}/seeder/specialties`);
    return response.data;
  }

  // Créer des utilisateurs de test
  async seedUsers(): Promise<SeederResult> {
    const response = await api.post(`${API_CONFIG.BASE_URL}/seeder/users`);
    return response.data;
  }

  // Créer des profils de test
  async seedProfiles(): Promise<SeederResult> {
    const response = await api.post(`${API_CONFIG.BASE_URL}/seeder/profiles`);
    return response.data;
  }

  // Créer des créneaux de test
  async seedSlots(): Promise<SeederResult> {
    const response = await api.post(`${API_CONFIG.BASE_URL}/seeder/slots`);
    return response.data;
  }

  // Créer des réservations de test
  async seedBookings(): Promise<SeederResult> {
    const response = await api.post(`${API_CONFIG.BASE_URL}/seeder/bookings`);
    return response.data;
  }

  // Créer des avis de test
  async seedReviews(): Promise<SeederResult> {
    const response = await api.post(`${API_CONFIG.BASE_URL}/seeder/reviews`);
    return response.data;
  }

  // Exécuter tous les seeders
  async seedAll(): Promise<SeederResult> {
    const response = await api.post(`${API_CONFIG.BASE_URL}/seeder/all`);
    return response.data;
  }

  // Réinitialiser la base de données
  async resetDatabase(): Promise<SeederResult> {
    const response = await api.post(`${API_CONFIG.BASE_URL}/seeder/reset`);
    return response.data;
  }

  // Nettoyer des données spécifiques
  async cleanData(entity: string): Promise<SeederResult> {
    const response = await api.delete(`${API_CONFIG.BASE_URL}/seeder/${entity}`);
    return response.data;
  }

  // Obtenir les statistiques de la BDD
  async getStats(): Promise<any> {
    const response = await api.get(`${API_CONFIG.BASE_URL}/seeder/stats`);
    return response.data;
  }
}

export const seederService = new SeederService();
