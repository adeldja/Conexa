import { BackendSlot, BackendBooking, GeneratedSlot } from '../types';

export class SlotConverter {
  static toGeneratedSlots(backendSlots: BackendSlot[], bookings: BackendBooking[] = []): GeneratedSlot[] {
    return backendSlots.map(slot => {
      const booking = bookings.find(b => 
        b.slotId === slot.id && 
        (b.status === 'CONFIRMED' || b.status === 'PENDING')
      );

      const startTime = new Date(slot.startTime);
      const endTime = new Date(slot.endTime);

      return {
        id: slot.id,
        date: startTime.toISOString().split('T')[0],
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
        status: this.getSlotStatus(slot, booking),
        booking: booking ? this.formatBooking(booking) : undefined,
        backendId: slot.id,
      };
    });
  }

  private static getSlotStatus(slot: BackendSlot, booking?: BackendBooking): 'available' | 'booked' | 'closed' {
    if (booking) return 'booked';
    if (!slot.isAvailable) return 'closed';
    return 'available';
  }

  private static formatBooking(booking: BackendBooking) {
    return {
      clientName: booking.client.fullName || booking.client.email,
      clientEmail: booking.client.email,
      status: booking.status,
    };
  }
}
