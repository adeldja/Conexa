import { User } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Slot {
  id: string;
  providerId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface CreateSlotDto {
  providerId: string;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
}

export interface UpdateSlotDto {
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
}

class AvailabilityService {
  private getAuthHeader(): Headers {
    const token = localStorage.getItem('conexa_token');
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  async getProviderSlots(providerId: string): Promise<Slot[]> {
    const response = await fetch(`${API_BASE_URL}/availability/provider/${providerId}`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des créneaux');
    }

    return response.json();
  }

  async getSlot(id: string): Promise<Slot> {
    const response = await fetch(`${API_BASE_URL}/availability/${id}`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération du créneau');
    }

    return response.json();
  }

  async createSlot(slotData: CreateSlotDto): Promise<Slot> {
    try {
      const headers = this.getAuthHeader();
      
      const response = await fetch(`${API_BASE_URL}/availability`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(slotData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Erreur lors de la création du créneau: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateSlot(id: string, slotData: UpdateSlotDto): Promise<Slot> {
    const response = await fetch(`${API_BASE_URL}/availability/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeader(),
      body: JSON.stringify(slotData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la mise à jour du créneau');
    }

    return response.json();
  }

  async deleteSlot(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/availability/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la suppression du créneau');
    }
  }

  // Helper methods for date formatting
  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString();
  }

  formatDateForDisplay(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatTimeForInput(date: string): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  }
}

export const availabilityService = new AvailabilityService();
