'use client';

import { useState } from 'react';
import { GeneratedSlot } from './types';
import { formatDate, formatTime } from './utils';
import SlotDetailsModal from './SlotDetailsModal';

interface SlotsCalendarProps {
  slots: GeneratedSlot[];
  onSlotStatusChange: (slotIndex: number, status: 'available' | 'closed') => void;
}

export default function SlotsCalendar({ slots, onSlotStatusChange }: SlotsCalendarProps) {
  const [selectedSlot, setSelectedSlot] = useState<GeneratedSlot | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const groupSlotsByDate = (slots: GeneratedSlot[]) => {
    return slots.reduce((groups, slot) => {
      const date = slot.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(slot);
      return groups;
    }, {} as Record<string, GeneratedSlot[]>);
  };

  const getSlotColorClasses = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'booked':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200 cursor-pointer';
      case 'closed':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const handleSlotClick = (slot: GeneratedSlot, index: number) => {
    console.log('🔧 Debug - Slot cliqué:', slot.status, slot.booking);
    
    if (slot.status === 'booked') {
      console.log('🔧 Debug - Ouverture modal pour slot réservé:', slot);
      setSelectedSlot(slot);
    } else if (slot.status === 'available') {
      onSlotStatusChange(index, 'closed');
    } else if (slot.status === 'closed') {
      onSlotStatusChange(index, 'available');
    }
  };

  const groupedSlots = groupSlotsByDate(slots);
  const sortedDates = Object.keys(groupedSlots).sort();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header avec sélecteur de vue */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">
          Mes créneaux ({slots.length} créneaux)
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Liste
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Calendrier
          </button>
        </div>
      </div>

      {/* Légende */}
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-slate-600">Disponible</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-slate-600">Réservé</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
            <span className="text-slate-600">Fermé</span>
          </div>
          <div className="text-slate-500">
            • Cliquez sur un créneau disponible pour le fermer
            • Cliquez sur un créneau fermé pour le rouvrir
            • Cliquez sur un créneau réservé pour voir les détails
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-6">
        {sortedDates.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun créneau généré</h4>
            <p className="text-gray-500">Configurez vos horaires hebdomadaires et générez vos créneaux.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <h4 className="font-medium text-slate-900">{formatDate(date)}</h4>
                  <p className="text-sm text-slate-500">{groupedSlots[date].length} créneaux</p>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                    {groupedSlots[date].map((slot, index) => {
                      const globalIndex = slots.findIndex(s => 
                        s.date === slot.date && 
                        s.startTime === slot.startTime && 
                        s.endTime === slot.endTime
                      );
                      
                      return (
                        <button
                          key={`${slot.startTime}-${slot.endTime}`}
                          onClick={() => handleSlotClick(slot, globalIndex)}
                          className={`
                            px-3 py-2 text-xs font-medium rounded-lg border transition-colors
                            ${getSlotColorClasses(slot.status)}
                            ${slot.status === 'available' || slot.status === 'closed' ? 'cursor-pointer' : ''}
                          `}
                          title={
                            slot.status === 'booked' && slot.booking
                              ? `Réservé par ${slot.booking.clientName}`
                              : slot.status === 'available'
                              ? 'Cliquer pour fermer'
                              : slot.status === 'closed'
                              ? 'Cliquer pour rouvrir'
                              : ''
                          }
                        >
                          <div className="text-center">
                            <div className="font-medium">
                              {formatTime(slot.startTime)}
                            </div>
                            <div className="opacity-75">
                              {formatTime(slot.endTime)}
                            </div>
                            {slot.status === 'booked' && (
                              <div className="mt-1 text-xs opacity-90">
                                {slot.booking?.clientName || 'Réservé'}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal pour les détails du créneau réservé */}
      <SlotDetailsModal
        slot={selectedSlot}
        isOpen={!!selectedSlot}
        onClose={() => setSelectedSlot(null)}
      />
    </div>
  );
}
