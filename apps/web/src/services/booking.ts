import { User } from '@/types/auth';
import { Slot } from './availability';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Provider extends User {
  // Ajoutez d'autres propriétés spécifiques au provider si nécessaire
}

export interface Booking {
  id: string;
  slotId: string;
  clientId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  slot?: Slot;
}

export interface CreateBookingDto {
  slotId: string;
  clientId: string;
}

class BookingService {
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

  async getProviders(): Promise<Provider[]> {
    const response = await fetch(`${API_BASE_URL}/users/providers`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des prestataires');
    }

    return response.json();
  }

  async getAvailableSlots(providerId: string): Promise<Slot[]> {
    const response = await fetch(`${API_BASE_URL}/availability/provider/${providerId}/available`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des créneaux disponibles');
    }

    return response.json();
  }

  async createBooking(bookingData: CreateBookingDto): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la création de la réservation');
    }

    return response.json();
  }

  async getClientBookings(clientId: string): Promise<Booking[]> {
    const response = await fetch(`${API_BASE_URL}/bookings/client/${clientId}`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des réservations');
    }

    return response.json();
  }

  async cancelBooking(bookingId: string): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'annulation de la réservation');
    }

    return response.json();
  }

  // Utilitaires de formatage
  formatStatus(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'CONFIRMED':
        return 'Confirmé';
      case 'CANCELLED':
        return 'Annulé';
      default:
        return status;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const bookingService = new BookingService();
