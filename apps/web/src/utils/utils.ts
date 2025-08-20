import { WeeklySchedule, GeneratedSlot, TimeSlot } from '../types/types';

export const generateTimeSlots = (start: string, end: string, intervalMinutes: number = 30): string[] => {
  const slots: string[] = [];
  const startTime = new Date(`2000-01-01T${start}`);
  const endTime = new Date(`2000-01-01T${end}`);
  
  let currentTime = new Date(startTime);
  
  while (currentTime < endTime) {
    const nextTime = new Date(currentTime.getTime() + intervalMinutes * 60000);
    if (nextTime <= endTime) {
      const startTimeStr = currentTime.toTimeString().slice(0, 5);
      const endTimeStr = nextTime.toTimeString().slice(0, 5);
      slots.push(`${startTimeStr}-${endTimeStr}`);
    }
    currentTime = nextTime;
  }
  
  return slots;
};

export const generateSlotsFromSchedule = (
  schedule: WeeklySchedule,
  startDate: Date,
  weeks: number = 4
): GeneratedSlot[] => {
  const slots: GeneratedSlot[] = [];
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (week * 7) + day);
      
      const dayKey = days[currentDate.getDay()];
      const daySchedule = schedule[dayKey];
      
      if (daySchedule?.enabled && daySchedule.timeSlots.length > 0) {
        daySchedule.timeSlots.forEach((timeSlot: TimeSlot) => {
          const timeSlots = generateTimeSlots(timeSlot.start, timeSlot.end);
          
          timeSlots.forEach((slot) => {
            const [startTime, endTime] = slot.split('-');
            slots.push({
              date: currentDate.toISOString().split('T')[0],
              startTime,
              endTime,
              status: 'available'
            });
          });
        });
      }
    }
  }
  
  return slots.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (time: string): string => {
  return time;
};

export const getWeekDates = (startDate: Date): Date[] => {
  const dates: Date[] = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};
