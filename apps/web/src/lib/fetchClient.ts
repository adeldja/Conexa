// Alternative avec fetch natif
import { API_CONFIG } from '@/apiConfig';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class FetchClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;
    
    // Construire l'URL avec les paramètres
    let url = `${this.baseURL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    // Ajouter les headers par défaut
    const headers = {
      ...this.defaultHeaders,
      ...fetchOptions.headers,
    };

    // TODO: Ajouter le token d'authentification
    // const token = getAuthToken();
    // if (token) {
    //   headers.Authorization = `Bearer ${token}`;
    // }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      // Gestion des erreurs HTTP
      if (!response.ok) {
        if (response.status === 401) {
          // TODO: Rediriger vers la page de connexion
          // window.location.href = '/login';
        }
        
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Parser la réponse JSON
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const fetchClient = new FetchClient(API_CONFIG.BASE_URL);
