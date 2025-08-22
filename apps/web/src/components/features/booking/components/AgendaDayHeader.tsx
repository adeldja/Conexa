import { Slot } from '@/services/availability';

interface TimeOfDayBadge {
  label: string;
  color: string;
}

interface AgendaDayHeaderProps {
  displayDate: string;
  slotsCount: number;
  timeGroups: Record<string, Slot[]>;
  isExpanded: boolean;
  onToggle: () => void;
}

function getTimeOfDayBadge(slot: Slot): TimeOfDayBadge {
  const hour = new Date(slot.startTime).getHours();
  if (hour < 12) {
    return { label: 'Matin', color: 'bg-blue-100 text-blue-700' };
  } else if (hour < 17) {
    return { label: 'Après-midi', color: 'bg-green-100 text-green-700' };
  } else {
    return { label: 'Soir', color: 'bg-purple-100 text-purple-700' };
  }
}

export default function AgendaDayHeader({
  displayDate,
  slotsCount,
  timeGroups,
  isExpanded,
  onToggle,
}: AgendaDayHeaderProps) {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 capitalize">{displayDate}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {slotsCount} créneau{slotsCount > 1 ? 'x' : ''}
          </span>
          {/* Badges de moment de journée */}
          <div className="flex space-x-2">
            {Object.keys(timeGroups).map(timeOfDay => {
              const badge = getTimeOfDayBadge(timeGroups[timeOfDay][0]);
              return (
                <span
                  key={timeOfDay}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
                >
                  {timeOfDay} ({timeGroups[timeOfDay].length})
                </span>
              );
            })}
          </div>
        </div>
        <button
          onClick={onToggle}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          {isExpanded ? 'Masquer' : 'Voir les créneaux'}
          <svg
            className={`ml-2 -mr-1 w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
