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
    // TODO: Récupérer le token depuis le contexte d'authentification
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
    if (error.response?.status === 401) {
      // TODO: Rediriger vers la page de connexion
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
