import { Slot } from '@/services/availability';

interface SlotCardProps {
  slot: Slot;
  onBookSlot: (slotId: string) => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SlotCard({ slot, onBookSlot }: SlotCardProps) {
  const startTime = new Date(slot.startTime);
  const endTime = new Date(slot.endTime);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-lg font-semibold text-gray-900">
              <span>{formatTime(startTime)}</span>
              <span className="text-gray-400">→</span>
              <span>{formatTime(endTime)}</span>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              Disponible
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Durée : {Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))} minutes
          </p>
        </div>
        <button
          onClick={() => onBookSlot(slot.id)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Réserver
        </button>
      </div>
    </div>
  );
}
