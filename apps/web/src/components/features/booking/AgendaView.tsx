import { useState, useMemo } from 'react';
import { Slot } from '@/services/availability';
import AgendaDayHeader from './components/AgendaDayHeader';
import AgendaDayContent from './components/AgendaDayContent';
import EmptyAgendaState from './components/EmptyAgendaState';
import { groupSlotsByDay, getTimeOfDayBadge } from './utils/agendaUtils';

interface AgendaViewProps {
  slots: Slot[];
  onBookSlot: (slotId: string) => void;
  loading: boolean;
}

export default function AgendaView({ slots, onBookSlot, loading }: AgendaViewProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const groupedSlots = useMemo(() => groupSlotsByDay(slots), [slots]);

  const toggleDay = (dateKey: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dateKey)) {
      newExpanded.delete(dateKey);
    } else {
      newExpanded.add(dateKey);
    }
    setExpandedDays(newExpanded);
  };

  if (slots.length === 0) {
    return <EmptyAgendaState />;
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
            <AgendaDayHeader
              displayDate={dayGroup.displayDate}
              slotsCount={dayGroup.slots.length}
              timeGroups={timeGroups}
              isExpanded={isExpanded}
              onToggle={() => toggleDay(dayGroup.date)}
            />
            <AgendaDayContent
              slots={dayGroup.slots}
              isExpanded={isExpanded}
              onBookSlot={onBookSlot}
            />
          </div>
        );
      })}
    </div>
  );
}
