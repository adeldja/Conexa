import axios from 'axios';

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  ENDPOINTS: {
    AVAILABILITY: '/availability',
    BOOKINGS: '/bookings',
    SLOTS: '/slots',
    USERS: '/users',
    AUTH: '/auth',
    PROFILES: '/profiles',
    SPECIALTIES: '/specialties',
    REVIEWS: '/reviews',
  },
} as const;

// Instance axios configurée
export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('conexa_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Laisser les composants gérer les erreurs 401 eux-mêmes
    // Ne pas rediriger automatiquement
    return Promise.reject(error);
  }
);
