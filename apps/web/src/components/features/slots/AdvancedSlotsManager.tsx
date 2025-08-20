'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { WeeklySchedule, GeneratedSlot, DEFAULT_WEEKLY_SCHEDULE } from '@/types/types';
import { advancedSlotsService } from '@/services/advancedSlotsService';
import WeeklyScheduleEditor from './WeeklyScheduleEditor';
import SlotsCalendar from './SlotsCalendar';

export default function AdvancedSlotsManager() {
  const { user } = useAuth();
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(DEFAULT_WEEKLY_SCHEDULE);
  const [generatedSlots, setGeneratedSlots] = useState<GeneratedSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);

  // Charger les slots existants au montage du composant
  useEffect(() => {
    if (user?.id) {
      loadExistingSlots();
    }
  }, [user?.id]);

  const loadExistingSlots = async () => {
    if (!user?.id) {
      console.log('🔧 Debug - Pas d\'utilisateur connecté');
      return;
    }

    console.log('🔧 Debug - Chargement des créneaux pour user:', user.id);

    try {
      setIsLoadingSlots(true);
      setError(null);
      
      console.log('🔧 Debug - Appel advancedSlotsService.getSlotsWithBookings');
      const slots = await advancedSlotsService.getSlotsWithBookings(user.id);
      console.log('🔧 Debug - Slots reçus:', slots);
      setGeneratedSlots(slots);
    } catch (error) {
      console.error('🔧 Debug - Erreur lors du chargement des créneaux:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement des créneaux');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleGenerateSlots = async (startDate?: Date, weekCount: number = 4) => {
    if (!user?.id) {
      setError('Utilisateur non connecté');
      return;
    }

    // Si aucune date de début n'est fournie, utiliser aujourd'hui
    const effectiveStartDate = startDate || new Date();
    effectiveStartDate.setHours(0, 0, 0, 0);

    try {
      setIsLoading(true);
      setError(null);

      // Calculer la date de fin
      const endDate = new Date(effectiveStartDate);
      endDate.setDate(effectiveStartDate.getDate() + (weekCount * 7) - 1);

      // Générer les créneaux à partir du planning
      const generatedSlots = advancedSlotsService.generateSlotsFromSchedule(
        weeklySchedule,
        effectiveStartDate,
        endDate,
      );

      if (generatedSlots.length === 0) {
        setError('Aucun créneau à générer avec ce planning');
        return;
      }

      // Convertir les GeneratedSlot en CreateSlotRequest
      const slotsToCreate = generatedSlots.map(slot => ({
        providerId: user.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.status === 'available'
      }));

      // Créer les créneaux dans le backend
      const createdSlots = await advancedSlotsService.createMultipleSlots(slotsToCreate);

      // Recharger tous les créneaux pour avoir l'état à jour
      await loadExistingSlots();

      console.log(`${createdSlots.length} créneaux créés avec succès`);
    } catch (error) {
      console.error('Erreur lors de la génération des créneaux:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la génération des créneaux');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotStatusChange = async (slotIndex: number, status: 'available' | 'closed') => {
    const slot = generatedSlots[slotIndex];
    if (!slot.backendId) {
      setError('Impossible de modifier ce créneau');
      return;
    }

    try {
      setError(null);
      
      // Mettre à jour dans le backend
      await advancedSlotsService.toggleSlotAvailability(
        slot.backendId, 
        status === 'available'
      );

      // Mettre à jour l'état local
      const updatedSlots = [...generatedSlots];
      updatedSlots[slotIndex] = { ...slot, status };
      setGeneratedSlots(updatedSlots);

    } catch (error) {
      console.error('Erreur lors de la modification du créneau:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la modification du créneau');
    }
  };

  const handleDeleteAllSlots = async () => {
    if (!user?.id) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer tous vos créneaux ? Cette action est irréversible.')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Supprimer tous les créneaux
      for (const slot of generatedSlots) {
        if (slot.backendId) {
          await advancedSlotsService.deleteSlot(slot.backendId);
        }
      }

      // Vider l'état local
      setGeneratedSlots([]);

    } catch (error) {
      console.error('Erreur lors de la suppression des créneaux:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la suppression des créneaux');
      // Recharger en cas d'erreur pour avoir l'état correct
      await loadExistingSlots();
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Vous devez être connecté pour gérer vos créneaux.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Message d'erreur global */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Configuration du planning hebdomadaire */}
      <WeeklyScheduleEditor
        schedule={weeklySchedule}
        onScheduleChange={setWeeklySchedule}
        onGenerateSlots={handleGenerateSlots}
        isLoading={isLoading}
      />

      {/* Actions rapides */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={loadExistingSlots}
          disabled={isLoadingSlots}
          className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingSlots ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Chargement...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </>
          )}
        </button>

        {generatedSlots.length > 0 && (
          <button
            onClick={handleDeleteAllSlots}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Supprimer tous les créneaux
          </button>
        )}
      </div>

      {/* Affichage des créneaux */}
      {isLoadingSlots ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
          <div className="text-center">
            <svg className="animate-spin mx-auto h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-slate-500">Chargement de vos créneaux...</p>
          </div>
        </div>
      ) : (
        <SlotsCalendar
          slots={generatedSlots}
          onSlotStatusChange={handleSlotStatusChange}
        />
      )}
    </div>
  );
}
