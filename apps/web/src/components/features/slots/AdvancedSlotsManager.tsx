'use client';

import { useState } from 'react';
import { useAdvancedSlots } from '@/hooks/useAdvancedSlots';
import WeeklyScheduleEditor from './WeeklyScheduleEditor';
import SlotsCalendar from './SlotsCalendar';

export default function AdvancedSlotsManager() {
  const {
    user,
    weeklySchedule,
    setWeeklySchedule,
    generatedSlots,
    setGeneratedSlots,
    isLoading,
    error,
    setError,
    isLoadingSlots,
    generateSlots,
    createSlots,
    deleteSlot,
    deleteAllSlots,
    updateSlotStatus,
  } = useAdvancedSlots();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [weekCount, setWeekCount] = useState<number>(4);

  const handleGenerateSlots = () => {
    generateSlots(startDate, weekCount);
  };

  const handleCreateSlots = () => {
    createSlots();
  };

  const handleDeleteSlot = (slotId: string) => {
    deleteSlot(slotId);
  };

  const handleDeleteAllSlots = () => {
    if (
      confirm(
        'Êtes-vous sûr de vouloir supprimer tous vos créneaux ? Cette action est irréversible.'
      )
    ) {
      deleteAllSlots();
    }
  };

  const clearError = () => {
    setError(null);
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Veuillez vous connecter pour gérer vos créneaux.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <p className="text-red-800">{error}</p>
            <button onClick={clearError} className="text-red-600 hover:text-red-800">
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration des horaires</h2>
          <WeeklyScheduleEditor schedule={weeklySchedule} onChange={setWeeklySchedule} />

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
              <input
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={e => setStartDate(new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de semaines
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={weekCount}
                onChange={e => setWeekCount(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleGenerateSlots}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Génération...' : 'Générer les créneaux'}
            </button>

            {generatedSlots.length > 0 && (
              <>
                <button
                  onClick={handleDeleteAllSlots}
                  disabled={isLoading}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Suppression...' : 'Supprimer tous les créneaux'}
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Calendrier des créneaux</h2>
          <SlotsCalendar
            slots={generatedSlots}
            onSlotStatusChange={async (slotIndex, status) => {
              console.log('Changement de statut:', slotIndex, status);
              await updateSlotStatus(slotIndex, status);
            }}
          />
        </div>
      </div>
    </div>
  );
}
