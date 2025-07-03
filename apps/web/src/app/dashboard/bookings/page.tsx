'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { bookingService, Provider } from '@/services/booking';
import { availabilityService, Slot } from '@/services/availability';

export default function BookingsPage() {
  const { user } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Charger la liste des prestataires au chargement de la page
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

  // Charger les créneaux disponibles quand un prestataire est sélectionné
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedProviderId) {
        setAvailableSlots([]);
        return;
      }

      try {
        setLoadingSlots(true);
        setError(null);
        const data = await availabilityService.getProviderSlots(selectedProviderId);
        // Filtrer pour ne garder que les créneaux disponibles
        const availableSlots = data.filter(slot => slot.isAvailable);
        // Trier par date
        availableSlots.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        setAvailableSlots(availableSlots);
      } catch (err: any) {
        setError('Erreur lors de la récupération des créneaux: ' + err.message);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedProviderId]);

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProviderId(e.target.value);
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
        clientId: user.id
      });
      
      setSuccess('Votre demande de réservation a été envoyée avec succès !');
      
      // Rafraîchir la liste des créneaux disponibles
      const updatedSlots = await availabilityService.getProviderSlots(selectedProviderId);
      const availableSlots = updatedSlots.filter(slot => slot.isAvailable);
      availableSlots.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      setAvailableSlots(availableSlots);
    } catch (err: any) {
      setError('Erreur lors de la réservation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Prendre un rendez-vous</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Sélectionnez un prestataire</h2>
          
          {loading ? (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="mb-4">
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedProviderId}
                onChange={handleProviderChange}
              >
                <option value="">-- Sélectionnez un prestataire --</option>
                {providers.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.fullName || provider.email}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        {selectedProviderId && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Créneaux disponibles</h2>
            
            {loadingSlots ? (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="p-4 bg-gray-100 text-gray-700 rounded">
                Aucun créneau disponible pour ce prestataire.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableSlots.map(slot => {
                  const startDate = new Date(slot.startTime);
                  const endDate = new Date(slot.endTime);
                  
                  return (
                    <div key={slot.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="mb-2">
                        <div className="font-semibold">
                          {startDate.toLocaleDateString('fr-FR')}
                        </div>
                        <div>
                          {startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          {' - '}
                          {endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <button
                        onClick={() => handleBookSlot(slot.id)}
                        className="w-full mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm"
                        disabled={loading}
                      >
                        Réserver
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
