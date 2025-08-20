import { WeeklySchedule, CreateSlotRequest } from '../types/types';

export class SlotGenerator {
  static generate(
    schedule: WeeklySchedule, 
    startDate: Date, 
    endDate: Date, 
    providerId: string
  ): CreateSlotRequest[] {
    const slots: CreateSlotRequest[] = [];
    const currentDate = new Date(startDate);
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    while (currentDate <= endDate) {
      const dayOfWeek = dayKeys[currentDate.getDay()];
      const daySchedule = schedule[dayOfWeek];

      if (daySchedule?.enabled) {
        slots.push(...this.generateDaySlots(daySchedule, currentDate, providerId));
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return slots;
  }

  private static generateDaySlots(daySchedule: any, date: Date, providerId: string): CreateSlotRequest[] {
    const slots: CreateSlotRequest[] = [];

    for (const timeSlot of daySchedule.timeSlots) {
      const [startHour, startMinute] = timeSlot.start.split(':').map(Number);
      const [endHour, endMinute] = timeSlot.end.split(':').map(Number);

      const slotStart = new Date(date);
      const slotEnd = new Date(date);
      slotStart.setHours(startHour, startMinute, 0, 0);
      slotEnd.setHours(endHour, endMinute, 0, 0);

      const current = new Date(slotStart);
      while (current < slotEnd) {
        const next = new Date(current);
        next.setMinutes(current.getMinutes() + 30);

        if (next <= slotEnd) {
          slots.push({
            providerId,
            startTime: current.toISOString(),
            endTime: next.toISOString(),
            isAvailable: true,
          });
        }

        current.setMinutes(current.getMinutes() + 30);
      }
    }

    return slots;
  }
}
