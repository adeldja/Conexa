import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  WeeklySchedule,
  GeneratedSlot,
  DEFAULT_WEEKLY_SCHEDULE,
  CreateSlotRequest,
} from '@/types/types';
import { advancedSlotsService } from '@/services/advancedSlotsService';

export function useAdvancedSlots() {
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
      return;
    }

    try {
      setIsLoadingSlots(true);
      setError(null);

      const slots = await advancedSlotsService.getSlotsWithBookings(user.id);
      setGeneratedSlots(slots);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement des créneaux');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const generateSlots = async (startDate?: Date, weekCount: number = 4) => {
    if (!user?.id) {
      setError('Utilisateur non connecté');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const actualStartDate = startDate || new Date();
      const endDate = new Date(actualStartDate);
      endDate.setDate(endDate.getDate() + weekCount * 7);

      const newSlots = await advancedSlotsService.generateSlotsFromSchedule(
        weeklySchedule,
        actualStartDate,
        endDate
      );

      setGeneratedSlots(newSlots);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Erreur lors de la génération des créneaux'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createSlots = async () => {
    if (!user?.id || generatedSlots.length === 0) {
      setError('Aucun créneau à créer');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Créer les slots un par un
      for (const slot of generatedSlots) {
        const slotToCreate: CreateSlotRequest = {
          startTime: slot.startTime,
          endTime: slot.endTime,
          providerId: user.id!,
        };
        await advancedSlotsService.createSlot(slotToCreate);
      }

      await loadExistingSlots(); // Recharger pour voir les nouveaux créneaux
      setGeneratedSlots([]); // Vider les créneaux générés
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la création des créneaux');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSlot = async (slotId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await advancedSlotsService.deleteSlot(slotId);
      await loadExistingSlots(); // Recharger après suppression
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la suppression du créneau');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAllSlots = async () => {
    if (!user?.id) {
      setError('Utilisateur non connecté');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Récupérer tous les créneaux de l'utilisateur
      const currentSlots = await advancedSlotsService.getSlotsWithBookings(user.id);

      // Supprimer chaque créneau individuellement
      const deletePromises = currentSlots
        .filter(slot => slot.backendId) // S'assurer qu'il y a un ID backend
        .map(slot => advancedSlotsService.deleteSlot(slot.backendId!));

      await Promise.allSettled(deletePromises);

      setGeneratedSlots([]); // Vider la liste locale
      await loadExistingSlots(); // Recharger pour s'assurer que tout est supprimé
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la suppression de tous les créneaux'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateSlotStatus = async (slotIndex: number, status: 'available' | 'closed') => {
    const slot = generatedSlots[slotIndex];
    if (!slot || !slot.backendId) {
      setError('Créneau introuvable');
      return;
    }

    try {
      // Mettre à jour immédiatement l'interface utilisateur
      setGeneratedSlots(prevSlots => {
        const newSlots = [...prevSlots];
        if (newSlots[slotIndex]) {
          newSlots[slotIndex] = {
            ...newSlots[slotIndex],
            status: status,
          };
        }
        return newSlots;
      });

      // Mettre à jour côté backend
      const isAvailable = status === 'available';
      await advancedSlotsService.toggleSlotAvailability(slot.backendId, isAvailable);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du créneau');
      // Recharger les créneaux en cas d'erreur pour revenir à l'état correct
      await loadExistingSlots();
    }
  };

  return {
    user,
    weeklySchedule,
    setWeeklySchedule,
    generatedSlots,
    setGeneratedSlots,
    isLoading,
    error,
    setError,
    isLoadingSlots,
    loadExistingSlots,
    generateSlots,
    createSlots,
    deleteSlot,
    deleteAllSlots,
    updateSlotStatus,
  };
}
