// Types pour les profils utilisateur étendus

export interface ClientProfile {
  id: string;
  userId: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
  preferences?: {
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
    preferredTimeSlots?: string[];
    language?: string;
  };
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName?: string;
  description?: string;
  phone?: string;
  website?: string;
  address?: string;
  avatar?: string;

  // Tarification
  defaultPrice?: number;
  currency: string;

  // Statistiques
  totalSlots: number;
  totalBookings: number;
  averageRating?: number;

  // Planning par défaut
  defaultSchedule?: {
    [key: string]: {
      enabled: boolean;
      timeSlots: Array<{ start: string; end: string }>;
    };
  };

  // Métadonnées
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;

  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
  specialties?: ProviderSpecialty[];
}

export interface Specialty {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: string;
}

export interface ProviderSpecialty {
  id: string;
  providerId: string;
  specialtyId: string;
  level?: 'Débutant' | 'Intermédiaire' | 'Confirmé' | 'Avancé' | 'Expert';
  certification?: string;
  createdAt: string;
  specialty: Specialty;
}

export interface Review {
  id: string;
  rating: number; // 1-5
  comment?: string;
  clientId: string;
  providerId: string;
  bookingId?: string;
  createdAt: string;
  updatedAt: string;

  // Relations populées
  client?: {
    id: string;
    fullName?: string;
    clientProfile?: Pick<ClientProfile, 'avatar'>;
  };
  provider?: {
    id: string;
    fullName?: string;
    providerProfile?: Pick<ProviderProfile, 'businessName' | 'avatar'>;
  };
}

// Types pour les requêtes de création/mise à jour
export interface CreateClientProfileRequest {
  phone?: string;
  dateOfBirth?: string;
  preferences?: ClientProfile['preferences'];
}

export interface UpdateClientProfileRequest extends Partial<CreateClientProfileRequest> {
  avatar?: string;
}

export interface CreateProviderProfileRequest {
  businessName?: string;
  description?: string;
  phone?: string;
  website?: string;
  address?: string;
  defaultPrice?: number;
  currency?: string;
  defaultSchedule?: ProviderProfile['defaultSchedule'];
}

export interface UpdateProviderProfileRequest extends Partial<CreateProviderProfileRequest> {
  avatar?: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
  providerId: string;
  bookingId?: string;
}

// Types pour les spécialités
export interface CreateSpecialtyRequest {
  name: string;
  description?: string;
  icon?: string;
}

export interface AddProviderSpecialtyRequest {
  specialtyId: string;
  level?: ProviderSpecialty['level'];
  certification?: string;
}
