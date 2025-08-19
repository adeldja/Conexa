'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { WeeklySchedule, GeneratedSlot, DEFAULT_WEEKLY_SCHEDULE } from './types';
import { advancedSlotsService } from './advancedSlotsService';
import WeeklyScheduleEditor from './WeeklyScheduleEditor';
import SlotsCalendar from './SlotsCalendar';
import { generateSlotsFromSchedule } from './utils';

// Données de démonstration pour simuler des créneaux réservés
const DEMO_BOOKINGS = [
  {
    date: '2025-08-25',
    startTime: '09:00',
    endTime: '09:30',
    booking: {
      clientName: 'Marie Dupont',
      clientEmail: 'marie.dupont@email.com',
      clientPhone: '06 12 34 56 78',
      notes: 'Première consultation'
    }
  },
  {
    date: '2025-08-25',
    startTime: '14:00',
    endTime: '14:30',
    booking: {
      clientName: 'Jean Martin',
      clientEmail: 'jean.martin@email.com',
      notes: 'Suivi mensuel'
    }
  },
  {
    date: '2025-08-26',
    startTime: '10:30',
    endTime: '11:00',
    booking: {
      clientName: 'Sophie Leroy',
      clientEmail: 'sophie.leroy@email.com',
      clientPhone: '07 98 76 54 32'
    }
  },
];

export default function AdvancedSlotsManager() {
  const [schedule, setSchedule] = useState<WeeklySchedule>(DEFAULT_WEEKLY_SCHEDULE);
  const [generatedSlots, setGeneratedSlots] = useState<GeneratedSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour appliquer les réservations de démonstration aux créneaux générés
  const applyDemoBookings = (slots: GeneratedSlot[]): GeneratedSlot[] => {
    return slots.map(slot => {
      const booking = DEMO_BOOKINGS.find(demo => 
        demo.date === slot.date && 
        demo.startTime === slot.startTime && 
        demo.endTime === slot.endTime
      );
      
      if (booking) {
        return {
          ...slot,
          status: 'booked' as const,
          booking: booking.booking
        };
      }
      
      return slot;
    });
  };

  const generateSlots = (startDate?: Date, weekCount?: number): Promise<void> => {
    setIsLoading(true);
    
    return new Promise<void>((resolve) => {
      // Simulation d'un délai pour montrer le loading
      setTimeout(() => {
        const date = startDate || new Date();
        date.setHours(0, 0, 0, 0);
        
        const slots = generateSlotsFromSchedule(schedule, date, weekCount || 4);
        const slotsWithBookings = applyDemoBookings(slots);
        
        setGeneratedSlots(slotsWithBookings);
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const handleSlotStatusChange = (slotIndex: number, status: 'available' | 'closed') => {
    const updatedSlots = [...generatedSlots];
    if (updatedSlots[slotIndex] && updatedSlots[slotIndex].status !== 'booked') {
      updatedSlots[slotIndex].status = status;
      setGeneratedSlots(updatedSlots);
    }
  };

  // Générer automatiquement les créneaux au premier rendu
  useEffect(() => {
    generateSlots();
  }, []);

  const stats = {
    total: generatedSlots.length,
    available: generatedSlots.filter(slot => slot.status === 'available').length,
    booked: generatedSlots.filter(slot => slot.status === 'booked').length,
    closed: generatedSlots.filter(slot => slot.status === 'closed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header avec titre et statistiques */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestion avancée des créneaux</h1>
            <p className="text-slate-600 mt-1">
              Configurez vos horaires hebdomadaires et gérez vos créneaux de rendez-vous
            </p>
          </div>
        </div>
        
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-sm text-slate-600">Total créneaux</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-green-700">Disponibles</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">{stats.booked}</div>
            <div className="text-sm text-red-700">Réservés</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
            <div className="text-sm text-gray-700">Fermés</div>
          </div>
        </div>
      </div>

      {/* Configuration des horaires */}
      <WeeklyScheduleEditor
        schedule={schedule}
        onScheduleChange={setSchedule}
        onGenerateSlots={generateSlots}
      />

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="inline-flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg text-slate-600">Génération des créneaux en cours...</span>
          </div>
        </div>
      )}

      {/* Calendrier des créneaux */}
      {!isLoading && (
        <SlotsCalendar
          slots={generatedSlots}
          onSlotStatusChange={handleSlotStatusChange}
        />
      )}
    </div>
  );
}
