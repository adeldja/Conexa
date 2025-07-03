'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { availabilityService, Slot, CreateSlotDto, UpdateSlotDto } from '@/services/availability';

interface SlotFormProps {
  slot?: Slot | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SlotForm({ slot, onSuccess, onCancel }: SlotFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    isAvailable: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si un slot est fourni, initialiser le formulaire avec ses valeurs
  useEffect(() => {
    if (slot) {
      setFormData({
        startTime: availabilityService.formatTimeForInput(slot.startTime),
        endTime: availabilityService.formatTimeForInput(slot.endTime),
        isAvailable: slot.isAvailable
      });
    } else {
      // Initialiser avec l'heure actuelle arrondie à la prochaine heure
      const now = new Date();
      now.setMinutes(0, 0, 0);
      now.setHours(now.getHours() + 1);
      
      const end = new Date(now);
      end.setHours(end.getHours() + 1);
      
      setFormData({
        startTime: now.toISOString().slice(0, 16),
        endTime: end.toISOString().slice(0, 16),
        isAvailable: true
      });
    }
  }, [slot]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('Vous devez être connecté pour créer un créneau');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Validation des dates
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);

      if (start >= end) {
        setError('L\'heure de fin doit être postérieure à l\'heure de début');
        return;
      }

      if (slot) {
        // Mise à jour d'un créneau existant
        const updateData: UpdateSlotDto = {
          startTime: formData.startTime,
          endTime: formData.endTime,
          isAvailable: formData.isAvailable
        };
        await availabilityService.updateSlot(slot.id, updateData);
      } else {
        // Création d'un nouveau créneau
        const createData: CreateSlotDto = {
          providerId: user.id,
          startTime: formData.startTime,
          endTime: formData.endTime,
          isAvailable: formData.isAvailable
        };
        await availabilityService.createSlot(createData);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        {slot ? 'Modifier le créneau' : 'Créer un nouveau créneau'}
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
            Date et heure de début
          </label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
            Date et heure de fin
          </label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
            Disponible pour réservation
          </label>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement...
              </span>
            ) : (
              slot ? 'Mettre à jour' : 'Créer'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
