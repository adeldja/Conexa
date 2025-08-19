import { 
  BackendSlot, 
  BackendBooking, 
  GeneratedSlot, 
  CreateSlotRequest, 
  UpdateSlotRequest,
  WeeklySchedule
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Composant pour la gestion des headers d'authentification
class AuthHeaderManager {
  static getHeaders(): Headers {
    const token = localStorage.getItem('conexa_token');
    const headers = new Headers({ 'Content-Type': 'application/json' });
    
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }
}

// Composant pour la gestion des appels API
class ApiClient {
  static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: AuthHeaderManager.getHeaders(),
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur réseau' }));
      throw new Error(error.message || 'Erreur API');
    }

    return response.json();
  }
}

// Composant pour la génération de créneaux
class SlotGenerator {
  static generate(
    schedule: WeeklySchedule, 
    startDate: Date, 
    endDate: Date, 
    providerId: string
  ): CreateSlotRequest[] {
    const slots: CreateSlotRequest[] = [];
    const currentDate = new Date(startDate);
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    while (currentDate <= endDate) {
      const dayOfWeek = dayKeys[currentDate.getDay()];
      const daySchedule = schedule[dayOfWeek];

      if (daySchedule?.enabled) {
        slots.push(...this.generateDaySlots(daySchedule, currentDate, providerId));
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return slots;
  }

  private static generateDaySlots(daySchedule: any, date: Date, providerId: string): CreateSlotRequest[] {
    const slots: CreateSlotRequest[] = [];

    for (const timeSlot of daySchedule.timeSlots) {
      const [startHour, startMinute] = timeSlot.start.split(':').map(Number);
      const [endHour, endMinute] = timeSlot.end.split(':').map(Number);

      const slotStart = new Date(date);
      const slotEnd = new Date(date);
      slotStart.setHours(startHour, startMinute, 0, 0);
      slotEnd.setHours(endHour, endMinute, 0, 0);

      const current = new Date(slotStart);
      while (current < slotEnd) {
        const next = new Date(current);
        next.setMinutes(current.getMinutes() + 30);

        if (next <= slotEnd) {
          slots.push({
            providerId,
            startTime: current.toISOString(),
            endTime: next.toISOString(),
            isAvailable: true,
          });
        }

        current.setMinutes(current.getMinutes() + 30);
      }
    }

    return slots;
  }
}

// Composant pour la conversion de données
class SlotConverter {
  static toGeneratedSlots(backendSlots: BackendSlot[], bookings: BackendBooking[] = []): GeneratedSlot[] {
    return backendSlots.map(slot => {
      const booking = bookings.find(b => 
        b.slotId === slot.id && 
        (b.status === 'CONFIRMED' || b.status === 'PENDING')
      );

      const startTime = new Date(slot.startTime);
      const endTime = new Date(slot.endTime);

      return {
        id: slot.id,
        date: startTime.toISOString().split('T')[0],
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
        status: this.getSlotStatus(slot, booking),
        booking: booking ? this.formatBooking(booking) : undefined,
        backendId: slot.id,
      };
    });
  }

  private static getSlotStatus(slot: BackendSlot, booking?: BackendBooking): 'available' | 'booked' | 'closed' {
    if (booking) return 'booked';
    if (!slot.isAvailable) return 'closed';
    return 'available';
  }

  private static formatBooking(booking: BackendBooking) {
    return {
      clientName: booking.client.fullName || booking.client.email,
      clientEmail: booking.client.email,
      status: booking.status,
    };
  }
}

// Service principal simplifié
class AdvancedSlotsService {
  // API calls
  async getProviderSlots(providerId: string): Promise<BackendSlot[]> {
    console.log('🔧 Récupération slots pour provider:', providerId);
    return ApiClient.request<BackendSlot[]>(`/availability/provider/${providerId}`);
  }

  async getProviderBookings(providerId: string): Promise<BackendBooking[]> {
    try {
      return await ApiClient.request<BackendBooking[]>(`/bookings/provider/${providerId}`);
    } catch (error) {
      console.warn('Impossible de récupérer les bookings:', error);
      return [];
    }
  }

  async createSlot(slotData: CreateSlotRequest): Promise<BackendSlot> {
    return ApiClient.request<BackendSlot>('/availability', {
      method: 'POST',
      body: JSON.stringify(slotData),
    });
  }

  async updateSlot(id: string, slotData: UpdateSlotRequest): Promise<BackendSlot> {
    return ApiClient.request<BackendSlot>(`/availability/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(slotData),
    });
  }

  async deleteSlot(id: string): Promise<void> {
    await ApiClient.request<void>(`/availability/${id}`, { method: 'DELETE' });
  }

  // Génération et gestion des créneaux
  generateSlotsFromSchedule = SlotGenerator.generate;

  async createMultipleSlots(slots: CreateSlotRequest[]): Promise<BackendSlot[]> {
    const results = await Promise.allSettled(
      slots.map(slot => this.createSlot(slot))
    );

    const createdSlots = results
      .filter((result): result is PromiseFulfilledResult<BackendSlot> => result.status === 'fulfilled')
      .map(result => result.value);

    const errors = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map(result => result.reason.message);

    if (errors.length > 0) {
      console.warn('Erreurs lors de la création:', errors);
    }

    return createdSlots;
  }

  convertBackendSlotsToGeneratedSlots = SlotConverter.toGeneratedSlots;

  async toggleSlotAvailability(slotId: string, isAvailable: boolean): Promise<BackendSlot> {
    return this.updateSlot(slotId, { isAvailable });
  }

  async getSlotsWithBookings(providerId: string): Promise<GeneratedSlot[]> {
    try {
      const [slots, bookings] = await Promise.all([
        this.getProviderSlots(providerId),
        this.getProviderBookings(providerId)
      ]);

      const result = SlotConverter.toGeneratedSlots(slots, bookings);
      
      console.log('🔧 Stats:', {
        total: result.length,
        booked: result.filter(s => s.status === 'booked').length,
        closed: result.filter(s => s.status === 'closed').length
      });

      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des slots avec bookings:', error);
      throw error;
    }
  }
}

export const advancedSlotsService = new AdvancedSlotsService();
