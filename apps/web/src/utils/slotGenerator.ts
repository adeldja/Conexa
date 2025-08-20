import { WeeklySchedule, CreateSlotRequest, DaySchedule } from '../types/types';

export class SlotGenerator {
  static generate(
    schedule: WeeklySchedule, 
    startDate: Date, 
    endDate: Date, 
    providerId: string
  ): CreateSlotRequest[] {
    console.log('🔧 SlotGenerator.generate appelé avec:', { schedule, startDate, endDate, providerId });
    
    const slots: CreateSlotRequest[] = [];
    const currentDate = new Date(startDate);
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    while (currentDate <= endDate) {
      const dayOfWeek = dayKeys[currentDate.getDay()];
      const daySchedule = schedule[dayOfWeek];
      
      console.log(`🔧 Jour ${currentDate.toISOString().split('T')[0]} (${dayOfWeek}):`, { 
        enabled: daySchedule?.enabled, 
        timeSlots: daySchedule?.timeSlots,
        getDay: currentDate.getDay()
      });

      if (daySchedule?.enabled) {
        // Créer une copie de la date pour éviter les mutations
        const dateForSlots = new Date(currentDate);
        const daySlots = this.generateDaySlots(daySchedule, dateForSlots, providerId);
        console.log(`🔧 Créneaux générés pour ${dayOfWeek}:`, daySlots.length);
        slots.push(...daySlots);
      }

      // Avancer au jour suivant
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log('🔧 Total créneaux générés:', slots.length);
    return slots;
  }

  private static generateDaySlots(daySchedule: DaySchedule, date: Date, providerId: string): CreateSlotRequest[] {
    const slots: CreateSlotRequest[] = [];
    
    console.log('🔧 generateDaySlots appelé avec:', { daySchedule, date: date.toISOString(), providerId });

    if (!daySchedule.timeSlots || daySchedule.timeSlots.length === 0) {
      console.log('🔧 Aucun timeSlot trouvé pour ce jour');
      return slots;
    }

    for (const timeSlot of daySchedule.timeSlots) {
      console.log('🔧 Traitement du timeSlot:', timeSlot);
      
      const [startHour, startMinute] = timeSlot.start.split(':').map(Number);
      const [endHour, endMinute] = timeSlot.end.split(':').map(Number);

      const slotStart = new Date(date);
      const slotEnd = new Date(date);
      slotStart.setHours(startHour, startMinute, 0, 0);
      slotEnd.setHours(endHour, endMinute, 0, 0);

      console.log('🔧 Plage horaire:', { 
        start: slotStart.toISOString(), 
        end: slotEnd.toISOString() 
      });

      const current = new Date(slotStart);
      while (current < slotEnd) {
        const next = new Date(current);
        next.setMinutes(current.getMinutes() + 30);

        if (next <= slotEnd) {
          const slot = {
            providerId,
            startTime: current.toISOString(),
            endTime: next.toISOString(),
            isAvailable: true,
          };
          console.log('🔧 Créneau créé:', slot);
          slots.push(slot);
        }

        current.setMinutes(current.getMinutes() + 30);
      }
    }

    console.log(`🔧 Total créneaux pour ce jour: ${slots.length}`);
    return slots;
  }
}
