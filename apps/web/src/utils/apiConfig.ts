export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 5000,
  endpoints: {
    slots: '/availability',
    bookings: '/bookings',
    users: '/users'
  }
};
