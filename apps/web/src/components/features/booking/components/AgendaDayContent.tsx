import { Slot } from '@/services/availability';
import SlotCard from './SlotCard';

interface AgendaDayContentProps {
  slots: Slot[];
  isExpanded: boolean;
  onBookSlot: (slotId: string) => void;
}

function getTimeOfDayBadge(slot: Slot) {
  const hour = new Date(slot.startTime).getHours();
  if (hour < 12) {
    return { label: 'Matin', color: 'bg-blue-100 text-blue-700' };
  } else if (hour < 17) {
    return { label: 'Après-midi', color: 'bg-green-100 text-green-700' };
  } else {
    return { label: 'Soir', color: 'bg-purple-100 text-purple-700' };
  }
}

export default function AgendaDayContent({ slots, isExpanded, onBookSlot }: AgendaDayContentProps) {
  if (!isExpanded) return null;

  const timeGroups = slots.reduce(
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
    <div className="p-6">
      <div className="space-y-6">
        {Object.entries(timeGroups).map(([timeOfDay, timeSlots]) => {
          const badge = getTimeOfDayBadge(timeSlots[0]);
          return (
            <div key={timeOfDay}>
              <div className="flex items-center mb-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
                >
                  {timeOfDay}
                </span>
                <div className="ml-3 flex-1 h-px bg-gray-200"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeSlots.map(slot => (
                  <SlotCard key={slot.id} slot={slot} onBookSlot={onBookSlot} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
