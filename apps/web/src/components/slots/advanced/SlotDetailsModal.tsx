'use client';

import { GeneratedSlot } from './types';
import { formatDate, formatTime } from './utils';

interface SlotDetailsModalProps {
  slot: GeneratedSlot | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SlotDetailsModal({ slot, isOpen, onClose }: SlotDetailsModalProps) {
  console.log('🔧 Debug - SlotDetailsModal rendu:', { 
    isOpen, 
    slotId: slot?.id, 
    slotStatus: slot?.status,
    hasBooking: !!slot?.booking,
    bookingData: slot?.booking 
  });
  
  if (!isOpen || !slot) {
    console.log('🔧 Debug - Modal fermée: isOpen=', isOpen, 'slot=', slot);
    return null;
  }

  if (!slot.booking) {
    console.log('🔧 Debug - Pas de données booking pour le slot:', slot);
    return null;
  }

  console.log('🔧 Debug - Modal va s\'afficher avec:', slot.booking);

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 z-[9998]"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl z-[9999] relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Détails de la réservation
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Informations du créneau */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Créneau</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Date :</span> {formatDate(slot.date)}</p>
                <p><span className="font-medium">Heure :</span> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}</p>
              </div>
            </div>

            {/* Informations du client */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3">Informations du client</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    Nom complet
                  </label>
                  <div className="text-sm text-blue-700 bg-white px-3 py-2 rounded border">
                    {slot.booking.clientName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    Email
                  </label>
                  <div className="text-sm text-blue-700 bg-white px-3 py-2 rounded border">
                    <a 
                      href={`mailto:${slot.booking.clientEmail}`}
                      className="hover:underline"
                    >
                      {slot.booking.clientEmail}
                    </a>
                  </div>
                </div>

                {slot.booking.clientPhone && (
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Téléphone
                    </label>
                    <div className="text-sm text-blue-700 bg-white px-3 py-2 rounded border">
                      <a 
                        href={`tel:${slot.booking.clientPhone}`}
                        className="hover:underline"
                      >
                        {slot.booking.clientPhone}
                      </a>
                    </div>
                  </div>
                )}

                {slot.booking.notes && (
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Notes
                    </label>
                    <div className="text-sm text-blue-700 bg-white px-3 py-2 rounded border">
                      {slot.booking.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                // TODO: Implémenter l'action de contact
                window.open(`mailto:${slot.booking?.clientEmail}`, '_blank');
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Contacter le client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
