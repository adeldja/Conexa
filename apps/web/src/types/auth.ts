export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: 'ADMIN' | 'CLIENT' | 'PROVIDER';
  timezone?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
  role?: 'ADMIN' | 'CLIENT' | 'PROVIDER';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
