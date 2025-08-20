import { useState, useMemo } from 'react';
import { Slot } from '@/services/availability';
import SlotsFilter, { FilterType, WeekFilter } from './SlotsFilter';
import DayGroup from './DayGroup';
import SlotsSkeleton from './SlotsSkeleton';

interface SlotsGridProps {
  slots: Slot[];
  onBookSlot: (slotId: string) => void;
  loading: boolean;
  loadingSlots: boolean;
}

export default function SlotsGrid({ slots, onBookSlot, loading, loadingSlots }: SlotsGridProps) {
  const [timeFilter, setTimeFilter] = useState<FilterType>('all');
  const [weekFilter, setWeekFilter] = useState<WeekFilter>('current');

  const handleFilterChange = (newTimeFilter: FilterType, newWeekFilter: WeekFilter) => {
    setTimeFilter(newTimeFilter);
    setWeekFilter(newWeekFilter);
  };

  const filteredSlots = useMemo(() => {
    let filtered = [...slots];

    // Filtre par moment de la journée
    if (timeFilter !== 'all') {
      filtered = filtered.filter(slot => {
        const hour = new Date(slot.startTime).getHours();
        switch (timeFilter) {
          case 'morning': return hour < 12;
          case 'afternoon': return hour >= 12 && hour < 17;
          case 'evening': return hour >= 17;
          default: return true;
        }
      });
    }

    // Filtre par semaine
    if (weekFilter !== 'all') {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const startOfNextWeek = new Date(endOfWeek);
      startOfNextWeek.setDate(endOfWeek.getDate() + 1);
      startOfNextWeek.setHours(0, 0, 0, 0);

      const endOfNextWeek = new Date(startOfNextWeek);
      endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
      endOfNextWeek.setHours(23, 59, 59, 999);

      filtered = filtered.filter(slot => {
        const slotDate = new Date(slot.startTime);
        if (weekFilter === 'current') {
          return slotDate >= startOfWeek && slotDate <= endOfWeek;
        } else if (weekFilter === 'next') {
          return slotDate >= startOfNextWeek && slotDate <= endOfNextWeek;
        }
        return true;
      });
    }

    return filtered;
  }, [slots, timeFilter, weekFilter]);

  const groupedSlots = useMemo(() => {
    const groups: Record<string, Slot[]> = {};
    
    filteredSlots.forEach(slot => {
      const date = new Date(slot.startTime).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(slot);
    });

    // Trier les groupes par date
    Object.keys(groups).forEach(date => {
      groups[date].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    });

    return groups;
  }, [filteredSlots]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedSlots).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [groupedSlots]);

  if (loadingSlots) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-semibold text-lg">Chargement des créneaux disponibles...</p>
              <p className="text-gray-500 text-sm mt-2">Recherche des disponibilités du prestataire</p>
            </div>
          </div>
        </div>
        <SlotsSkeleton />
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="p-6 bg-gray-100 rounded-2xl mb-6">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun créneau disponible</h3>
          <p className="text-gray-600 text-center max-w-md leading-relaxed">
            Ce prestataire n'a pas de créneaux disponibles pour le moment. 
            Essayez de sélectionner un autre prestataire ou revenez plus tard.
          </p>
        </div>
      </div>
    );
  }

  if (filteredSlots.length === 0) {
    return (
      <div className="space-y-6">
        <SlotsFilter 
          onFilterChange={handleFilterChange}
          totalSlots={slots.length}
        />
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="p-6 bg-yellow-100 rounded-2xl mb-6">
              <svg className="w-16 h-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun créneau pour ces critères</h3>
            <p className="text-gray-600 text-center max-w-md leading-relaxed mb-6">
              Aucun créneau ne correspond aux filtres sélectionnés. 
              Essayez de modifier vos critères de recherche.
            </p>
            <button 
              onClick={() => handleFilterChange('all', 'all')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SlotsFilter 
        onFilterChange={handleFilterChange}
        totalSlots={filteredSlots.length}
      />
      
      <div className="space-y-6">
        {sortedDates.map(date => (
          <DayGroup
            key={date}
            date={date}
            slots={groupedSlots[date]}
            onBookSlot={onBookSlot}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}
