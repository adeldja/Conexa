export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  ENDPOINTS: {
    AVAILABILITY: '/availability',
    BOOKINGS: '/bookings',
  },
} as const;
