import { Slot } from '@/services/availability';

export interface DaySlots {
  date: string;
  displayDate: string;
  slots: Slot[];
}

export function groupSlotsByDay(slots: Slot[]): DaySlots[] {
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
    groups[date].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  });

  // Convertir en format plus utilisable
  return Object.keys(groups)
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
}

export function getTimeOfDayBadge(slot: Slot) {
  const hour = new Date(slot.startTime).getHours();
  if (hour < 12) {
    return { label: 'Matin', color: 'bg-blue-100 text-blue-700' };
  } else if (hour < 17) {
    return { label: 'Après-midi', color: 'bg-green-100 text-green-700' };
  } else {
    return { label: 'Soir', color: 'bg-purple-100 text-purple-700' };
  }
}
