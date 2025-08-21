'use client';

import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { ProviderSelector, SlotsGrid, NotificationMessages } from '@/components/features/booking';
import { useBookingLogic } from '@/hooks/useBookingLogic';

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
    handleBookSlot,
  } = useBookingLogic();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Prendre un rendez-vous
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Choisissez un créneau et réservez en un clic. Simple, rapide et efficace.
            </p>
          </div>

          <NotificationMessages error={error} success={success} />

          <ProviderSelector
            providers={providers}
            selectedProviderId={selectedProviderId}
            onProviderChange={handleProviderChange}
            loading={loading}
          />

          {selectedProviderId && (
            <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Créneaux disponibles</h2>
                </div>
              </div>

              <div className="p-8">
                <SlotsGrid
                  slots={availableSlots}
                  onBookSlot={handleBookSlot}
                  loading={loading}
                  loadingSlots={loadingSlots}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
