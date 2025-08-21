import { useState } from 'react';
import { Slot } from '@/services/availability';
import SlotCard from './SlotCard';

interface DayGroupProps {
  date: string;
  slots: Slot[];
  onBookSlot: (slotId: string) => void;
  loading: boolean;
}

export default function DayGroup({ date, slots, onBookSlot, loading }: DayGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTimeOfDay = (time: string) => {
    const hour = new Date(time).getHours();
    if (hour < 12) return 'matin';
    if (hour < 17) return 'après-midi';
    return 'soir';
  };

  const getTimeStats = () => {
    const stats = slots.reduce(
      (acc, slot) => {
        const timeOfDay = getTimeOfDay(slot.startTime);
        acc[timeOfDay] = (acc[timeOfDay] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return stats;
  };

  const timeStats = getTimeStats();

  const getBadgeColor = (period: string) => {
    switch (period) {
      case 'matin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'après-midi':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'soir':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'matin':
        return '🌅';
      case 'après-midi':
        return '☀️';
      case 'soir':
        return '🌙';
      default:
        return '🕐';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
      {/* Header collapsible */}
      <div
        className="sticky top-0 z-10 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 cursor-pointer hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <svg
                  className="w-6 h-6 text-gray-600"
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
              <div>
                <h3 className="text-2xl font-bold text-gray-900 capitalize">{formatDate(date)}</h3>
                <p className="text-gray-600 font-medium">
                  {slots.length} créneau{slots.length > 1 ? 'x' : ''} disponible
                  {slots.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Badges des périodes */}
              <div className="hidden md:flex items-center space-x-2">
                {Object.entries(timeStats).map(([period, count]) => (
                  <div
                    key={period}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getBadgeColor(period)} flex items-center space-x-1`}
                  >
                    <span>{getPeriodIcon(period)}</span>
                    <span className="capitalize">{period}</span>
                    <span className="ml-1 font-bold">({count})</span>
                  </div>
                ))}
              </div>

              {/* Icône expand/collapse */}
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu collapsible */}
      {isExpanded && (
        <div className="p-8">
          {slots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">
                Aucun créneau disponible pour cette journée
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slots.map(slot => (
                <SlotCard key={slot.id} slot={slot} onBook={onBookSlot} loading={loading} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
