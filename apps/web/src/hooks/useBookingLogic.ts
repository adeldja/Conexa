import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService, Provider } from '@/services/booking';
import { availabilityService, Slot } from '@/services/availability';

export function useBookingLogic() {
  const { user } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Charger la liste des prestataires
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bookingService.getProviders();
        setProviders(data);
      } catch (err: any) {
        setError('Erreur lors de la récupération des prestataires: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // Charger les créneaux disponibles
  const fetchAvailableSlots = async (providerId: string) => {
    if (!providerId) {
      setAvailableSlots([]);
      return;
    }

    try {
      setLoadingSlots(true);
      setError(null);
      const data = await availabilityService.getProviderSlots(providerId);
      const availableSlots = data.filter(slot => slot.isAvailable);
      availableSlots.sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      setAvailableSlots(availableSlots);
    } catch (err: any) {
      setError('Erreur lors de la récupération des créneaux: ' + err.message);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchAvailableSlots(selectedProviderId);
  }, [selectedProviderId]);

  const handleProviderChange = (providerId: string) => {
    setSelectedProviderId(providerId);
  };

  const handleBookSlot = async (slotId: string) => {
    if (!user?.id) {
      setError('Vous devez être connecté pour réserver un créneau');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await bookingService.createBooking({
        slotId,
        clientId: user.id,
      });

      setSuccess('Votre demande de réservation a été envoyée avec succès !');

      // Rafraîchir la liste des créneaux
      await fetchAvailableSlots(selectedProviderId);
    } catch (err: any) {
      setError('Erreur lors de la réservation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    providers,
    selectedProviderId,
    availableSlots,
    loading,
    loadingSlots,
    error,
    success,
    handleProviderChange,
    handleBookSlot,
  };
}
