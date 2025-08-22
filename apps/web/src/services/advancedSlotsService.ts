import {
  BackendSlot,
  BackendBooking,
  GeneratedSlot,
  CreateSlotRequest,
  UpdateSlotRequest,
  WeeklySchedule,
} from '@/types/types';
import { ApiClient } from '@/utils/apiClient';
import { SlotGenerator } from '@/utils/slotGenerator';
import { SlotConverter } from '@/utils/slotConverter';
import { API_CONFIG } from '@/apiConfig';

// Service principal simplifié
class AdvancedSlotsService {
  // API calls
  async getProviderSlots(providerId: string): Promise<BackendSlot[]> {
    console.log('🔧 Récupération slots pour provider:', providerId);
    return ApiClient.request<BackendSlot[]>(
      `${API_CONFIG.ENDPOINTS.AVAILABILITY}/provider/${providerId}`
    );
  }

  async getProviderBookings(providerId: string): Promise<BackendBooking[]> {
    try {
      return await ApiClient.request<BackendBooking[]>(
        `${API_CONFIG.ENDPOINTS.BOOKINGS}/provider/${providerId}`
      );
    } catch (error) {
      console.warn('Impossible de récupérer les bookings:', error);
      return [];
    }
  }

  async createSlot(slotData: CreateSlotRequest): Promise<BackendSlot> {
    return ApiClient.request<BackendSlot>(API_CONFIG.ENDPOINTS.AVAILABILITY, {
      method: 'POST',
      body: JSON.stringify(slotData),
    });
  }

  async updateSlot(id: string, slotData: UpdateSlotRequest): Promise<BackendSlot> {
    return ApiClient.request<BackendSlot>(`${API_CONFIG.ENDPOINTS.AVAILABILITY}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(slotData),
    });
  }

  async deleteSlot(id: string): Promise<void> {
    await ApiClient.request<void>(`${API_CONFIG.ENDPOINTS.AVAILABILITY}/${id}`, {
      method: 'DELETE',
    });
  }

  // Génération et gestion des créneaux
  generateSlotsFromSchedule(
    schedule: WeeklySchedule,
    startDate: Date,
    endDate: Date
  ): GeneratedSlot[] {
    // Utiliser un providerId temporaire pour la génération
    const tempProviderId = 'temp';

    // Générer les créneaux avec SlotGenerator
    const createRequests = SlotGenerator.generate(schedule, startDate, endDate, tempProviderId);

    // Convertir les CreateSlotRequest en GeneratedSlot
    return createRequests.map(request => {
      const startDateTime = new Date(request.startTime);
      const endDateTime = new Date(request.endTime);

      return {
        date: startDateTime.toISOString().split('T')[0], // Format YYYY-MM-DD
        startTime: startDateTime.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        endTime: endDateTime.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'available' as const,
        // Stocker les valeurs ISO pour faciliter la conversion
        _startTimeISO: request.startTime,
        _endTimeISO: request.endTime,
      };
    });
  }

  async createMultipleSlots(slots: CreateSlotRequest[]): Promise<BackendSlot[]> {
    const results = await Promise.allSettled(slots.map(slot => this.createSlot(slot)));

    const createdSlots = results
      .filter(
        (result): result is PromiseFulfilledResult<BackendSlot> => result.status === 'fulfilled'
      )
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
        this.getProviderBookings(providerId),
      ]);

      const result = SlotConverter.toGeneratedSlots(slots, bookings);

      console.log('🔧 Stats:', {
        total: result.length,
        booked: result.filter(s => s.status === 'booked').length,
        closed: result.filter(s => s.status === 'closed').length,
      });

      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des slots avec bookings:', error);
      throw error;
    }
  }
}

export const advancedSlotsService = new AdvancedSlotsService();
