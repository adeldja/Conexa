import { Slot } from '@/services/availability';

interface SlotCardProps {
  slot: Slot;
  onBook: (slotId: string) => void;
  loading: boolean;
}

export default function SlotCard({ slot, onBook, loading }: SlotCardProps) {
  const startDate = new Date(slot.startTime);
  const endDate = new Date(slot.endTime);

  const handleBook = () => {
    onBook(slot.id);
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="mb-2">
        <div className="font-semibold">
          {startDate.toLocaleDateString('fr-FR')}
        </div>
        <div>
          {startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          {' - '}
          {endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      <button
        onClick={handleBook}
        className="w-full mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm"
        disabled={loading}
      >
        Réserver
      </button>
    </div>
  );
}
