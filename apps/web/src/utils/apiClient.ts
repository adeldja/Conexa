import { API_CONFIG } from '@/apiConfig';
import { AuthHeaderManager } from './authManager';

export class ApiClient {
  static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: AuthHeaderManager.getHeaders(),
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur réseau' }));
      throw new Error(error.message || 'Erreur API');
    }

    return response.json();
  }
}
