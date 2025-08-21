'use client';

import { useState } from 'react';
import { availabilityService, Slot } from '@/services/availability';

interface DeleteSlotModalProps {
  slot: Slot | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteSlotModal({
  slot,
  isOpen,
  onClose,
  onSuccess,
}: DeleteSlotModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !slot) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await availabilityService.deleteSlot(slot.id);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const startDate = new Date(slot.startTime);
  const formatDate = startDate.toLocaleDateString('fr-FR');
  const formatTime = startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <p className="mb-4">
          Êtes-vous sûr de vouloir supprimer le créneau du {formatDate} à {formatTime} ?
          <br />
          Cette action est irréversible.
        </p>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Suppression...
              </span>
            ) : (
              'Supprimer'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
