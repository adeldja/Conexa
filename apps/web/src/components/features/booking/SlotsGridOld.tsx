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
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-6"></div>
        <p className="text-gray-600 font-semibold text-lg">
          Chargement des créneaux disponibles...
        </p>
        <p className="text-gray-500 text-sm mt-2">Veuillez patienter quelques instants</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8">
        <div className="p-4 bg-gray-100 rounded-2xl mb-6">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun créneau disponible</h3>
        <p className="text-gray-600 text-center max-w-md leading-relaxed">
          Ce prestataire n'a pas de créneaux disponibles pour le moment. Essayez de sélectionner un
          autre prestataire ou revenez plus tard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-600 font-medium">
          {slots.length} créneau{slots.length > 1 ? 'x' : ''} disponible
          {slots.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slots.map(slot => (
          <SlotCard key={slot.id} slot={slot} onBook={onBookSlot} loading={loading} />
        ))}
      </div>
    </div>
  );
}
