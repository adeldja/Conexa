import { useState } from 'react';

export type FilterType = 'all' | 'morning' | 'afternoon' | 'evening';
export type WeekFilter = 'current' | 'next' | 'all';

interface SlotsFilterProps {
  onFilterChange: (timeFilter: FilterType, weekFilter: WeekFilter) => void;
  totalSlots: number;
}

export default function SlotsFilter({ onFilterChange, totalSlots }: SlotsFilterProps) {
  const [timeFilter, setTimeFilter] = useState<FilterType>('all');
  const [weekFilter, setWeekFilter] = useState<WeekFilter>('current');

  const handleTimeFilterChange = (filter: FilterType) => {
    setTimeFilter(filter);
    onFilterChange(filter, weekFilter);
  };

  const handleWeekFilterChange = (filter: WeekFilter) => {
    setWeekFilter(filter);
    onFilterChange(timeFilter, filter);
  };

  const timeFilters = [
    { value: 'all' as FilterType, label: 'Tous', icon: '🕐' },
    { value: 'morning' as FilterType, label: 'Matin', icon: '🌅' },
    { value: 'afternoon' as FilterType, label: 'Après-midi', icon: '☀️' },
    { value: 'evening' as FilterType, label: 'Soir', icon: '🌅' },
  ];

  const weekFilters = [
    { value: 'current' as WeekFilter, label: 'Cette semaine' },
    { value: 'next' as WeekFilter, label: 'Semaine prochaine' },
    { value: 'all' as WeekFilter, label: 'Toutes' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Filtres de période */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Période d'affichage
          </h3>
          <div className="flex flex-wrap gap-2">
            {weekFilters.map(filter => (
              <button
                key={filter.value}
                onClick={() => handleWeekFilterChange(filter.value)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  weekFilter === filter.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtres par moment */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Moment de la journée
          </h3>
          <div className="flex flex-wrap gap-2">
            {timeFilters.map(filter => (
              <button
                key={filter.value}
                onClick={() => handleTimeFilterChange(filter.value)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                  timeFilter === filter.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Compteur */}
        <div className="flex items-center space-x-3 px-4 py-3 bg-blue-50 rounded-xl">
          <div className="p-2 bg-blue-100 rounded-lg">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-blue-900 font-bold text-lg">{totalSlots}</p>
            <p className="text-blue-700 text-sm">créneau{totalSlots > 1 ? 'x' : ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
