export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  ENDPOINTS: {
    AVAILABILITY: '/availability',
    BOOKINGS: '/bookings',
    SLOTS: '/slots',
    USERS: '/users',
    AUTH: '/auth',
  },
} as const;
