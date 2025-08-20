// Types pour la gestion avancée des créneaux - Compatible avec le backend

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DaySchedule {
  day: string;
  dayName: string;
  enabled: boolean;
  timeSlots: TimeSlot[];
}

export interface WeeklySchedule {
  [key: string]: DaySchedule;
}

// Types backend compatibles
export interface BackendSlot {
  id: string;
  providerId: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  isAvailable: boolean;
  createdAt: string;
  bookings?: BackendBooking[];
}

export interface BackendBooking {
  id: string;
  slotId: string;
  clientId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  client: {
    id: string;
    email: string;
    fullName?: string;
  };
}

export interface GeneratedSlot {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'closed';
  booking?: {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    notes?: string;
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  };
  backendId?: string; // ID du slot dans le backend
}

export interface CreateSlotRequest {
  providerId: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  isAvailable?: boolean;
}

export interface UpdateSlotRequest {
  startTime?: string; // ISO string
  endTime?: string;   // ISO string
  isAvailable?: boolean;
}

export const DAYS_OF_WEEK = [
  { key: 'monday', name: 'Lundi' },
  { key: 'tuesday', name: 'Mardi' },
  { key: 'wednesday', name: 'Mercredi' },
  { key: 'thursday', name: 'Jeudi' },
  { key: 'friday', name: 'Vendredi' },
  { key: 'saturday', name: 'Samedi' },
  { key: 'sunday', name: 'Dimanche' },
];

export const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = {
  monday: {
    day: 'monday',
    dayName: 'Lundi',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '17:00' }]
  },
  tuesday: {
    day: 'tuesday',
    dayName: 'Mardi',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '17:00' }]
  },
  wednesday: {
    day: 'wednesday',
    dayName: 'Mercredi',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '17:00' }]
  },
  thursday: {
    day: 'thursday',
    dayName: 'Jeudi',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '17:00' }]
  },
  friday: {
    day: 'friday',
    dayName: 'Vendredi',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '17:00' }]
  },
  saturday: {
    day: 'saturday',
    dayName: 'Samedi',
    enabled: false,
    timeSlots: []
  },
  sunday: {
    day: 'sunday',
    dayName: 'Dimanche',
    enabled: false,
    timeSlots: []
  },
};
