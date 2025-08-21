export const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateShort = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    month: 'short',
    day: 'numeric',
  });
};

export const formatTimeRange = (startTime: Date, endTime: Date) => {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

export const groupSlotsByDate = <T extends { startTime: string }>(slots: T[]) => {
  const grouped = slots.reduce(
    (acc, slot) => {
      const date = new Date(slot.startTime).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(slot);
      return acc;
    },
    {} as Record<string, T[]>
  );

  return Object.entries(grouped)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([dateString, slots]) => ({
      date: new Date(dateString),
      slots: slots.sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      ),
    }));
};

export const isToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isTomorrow = (date: Date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
};
