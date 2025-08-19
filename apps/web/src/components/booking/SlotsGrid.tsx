import { Slot } from '@/services/availability';
import SlotCard from './SlotCard';

interface SlotsGridProps {
  slots: Slot[];
  onBookSlot: (slotId: string) => void;
  loading: boolean;
  loadingSlots: boolean;
}

export default function SlotsGrid({ slots, onBookSlot, loading, loadingSlots }: SlotsGridProps) {
  if (loadingSlots) {
    return (
      <div className="flex justify-center my-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="p-4 bg-gray-100 text-gray-700 rounded">
        Aucun créneau disponible pour ce prestataire.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {slots.map(slot => (
        <SlotCard
          key={slot.id}
          slot={slot}
          onBook={onBookSlot}
          loading={loading}
        />
      ))}
    </div>
  );
}
