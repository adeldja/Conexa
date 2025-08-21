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

// Types pour la gestion du profil étendu
export interface UserProfileData {
  // Informations de base (tous utilisateurs)
  fullName?: string;
  bio?: string;
  phone?: string;
  avatar?: string;

  // Informations provider (conditionnelles)
  hourlyRate?: number;
  zone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  companyName?: string;
  siret?: string;
}

export interface ProfileFormData extends UserProfileData {
  // Champs calculés pour l'UI
  completionPercentage?: number;
  isComplete?: boolean;
}

export interface UpdateProfileRequest {
  user?: {
    fullName?: string;
  };
  clientProfile?: {
    phone?: string;
    avatar?: string;
    // Autres champs client si nécessaire
  };
  providerProfile?: {
    businessName?: string;
    description?: string;
    phone?: string;
    address?: string;
    defaultPrice?: number;
    // Autres champs provider
  };
}
