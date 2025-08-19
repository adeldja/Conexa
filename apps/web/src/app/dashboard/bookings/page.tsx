'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  ProviderSelector, 
  SlotsGrid, 
  NotificationMessages, 
  useBookingLogic 
} from '@/components/booking';

export default function BookingsPage() {
  const {
    providers,
    selectedProviderId,
    availableSlots,
    loading,
    loadingSlots,
    error,
    success,
    handleProviderChange,
    handleBookSlot
  } = useBookingLogic();

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Prendre un rendez-vous</h1>
        
        <NotificationMessages error={error} success={success} />
        
        <ProviderSelector
          providers={providers}
          selectedProviderId={selectedProviderId}
          onProviderChange={handleProviderChange}
          loading={loading}
        />
        
        {selectedProviderId && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Créneaux disponibles</h2>
            
            <SlotsGrid
              slots={availableSlots}
              onBookSlot={handleBookSlot}
              loading={loading}
              loadingSlots={loadingSlots}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
