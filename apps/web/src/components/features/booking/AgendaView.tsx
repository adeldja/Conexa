import { useState, useMemo } from 'react';
import { Slot } from '@/services/availability';

interface AgendaViewProps {
  slots: Slot[];
  onBookSlot: (slotId: string) => void;
  loading: boolean;
}

interface DaySlots {
  date: string;
  displayDate: string;
  slots: Slot[];
}

export default function AgendaView({ slots, onBookSlot, loading }: AgendaViewProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const groupedSlots = useMemo(() => {
    const groups: Record<string, Slot[]> = {};

    slots.forEach(slot => {
      const date = new Date(slot.startTime);
      const dateKey = date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(slot);
    });

    // Trier les créneaux de chaque jour
    Object.keys(groups).forEach(date => {
      groups[date].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    });

    // Convertir en format plus utilisable
    const daySlots: DaySlots[] = Object.keys(groups)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map(dateKey => {
        const date = new Date(dateKey);
        return {
          date: dateKey,
          displayDate: date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          slots: groups[dateKey],
        };
      });

    return daySlots;
  }, [slots]);

  const toggleDay = (dateKey: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dateKey)) {
      newExpanded.delete(dateKey);
    } else {
      newExpanded.add(dateKey);
    }
    setExpandedDays(newExpanded);
  };

  const getTimeOfDayBadge = (slot: Slot) => {
    const hour = new Date(slot.startTime).getHours();
    if (hour < 12) {
      return { label: 'Matin', color: 'bg-blue-100 text-blue-700' };
    } else if (hour < 17) {
      return { label: 'Après-midi', color: 'bg-green-100 text-green-700' };
    } else {
      return { label: 'Soir', color: 'bg-purple-100 text-purple-700' };
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (slots.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun créneau disponible</h3>
          <p className="text-gray-600">
            Ce professionnel n'a pas de créneaux libres pour le moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupedSlots.map(dayGroup => {
        const isExpanded = expandedDays.has(dayGroup.date);
        const timeGroups = dayGroup.slots.reduce(
          (acc, slot) => {
            const badge = getTimeOfDayBadge(slot);
            if (!acc[badge.label]) {
              acc[badge.label] = [];
            }
            acc[badge.label].push(slot);
            return acc;
          },
          {} as Record<string, Slot[]>
        );

        return (
          <div
            key={dayGroup.date}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            {/* En-tête du jour */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {dayGroup.displayDate}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {dayGroup.slots.length} créneau{dayGroup.slots.length > 1 ? 'x' : ''}
                  </span>
                  {/* Badges de moment de journée */}
                  <div className="flex space-x-2">
                    {Object.keys(timeGroups).map(timeOfDay => {
                      const badge = getTimeOfDayBadge(timeGroups[timeOfDay][0]);
                      return (
                        <span
                          key={timeOfDay}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}
                        >
                          {timeOfDay}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={() => toggleDay(dayGroup.date)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
                </button>
              </div>
            </div>

            {/* Liste des créneaux */}
            <div
              className={`transition-all duration-300 ${isExpanded ? 'max-h-0 overflow-hidden' : ''}`}
            >
              <div className="divide-y divide-gray-100">
                {dayGroup.slots.map(slot => {
                  const startTime = new Date(slot.startTime);
                  const endTime = new Date(slot.endTime);

                  return (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Icône horloge */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <svg
                              className="w-5 h-5 text-blue-600"
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
                        </div>

                        {/* Informations horaires */}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold text-gray-900">
                              {formatTime(startTime)}
                            </span>
                            <span className="text-gray-400">-</span>
                            <span className="text-lg font-medium text-gray-700">
                              {formatTime(endTime)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Durée :{' '}
                            {Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))}{' '}
                            min
                          </p>
                        </div>
                      </div>

                      {/* Bouton de réservation */}
                      <button
                        onClick={() => onBookSlot(slot.id)}
                        disabled={loading}
                        className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Réservation...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4 mr-2"
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
                            Réserver
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
