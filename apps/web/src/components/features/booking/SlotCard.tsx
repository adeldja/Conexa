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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTimeOfDay = () => {
    const hour = startDate.getHours();
    if (hour < 12) return { label: 'Matin', color: 'bg-yellow-100 text-yellow-800', icon: '🌅' };
    if (hour < 17) return { label: 'Après-midi', color: 'bg-orange-100 text-orange-800', icon: '☀️' };
    return { label: 'Soir', color: 'bg-purple-100 text-purple-800', icon: '🌙' };
  };

  const timeOfDay = getTimeOfDay();

  return (
    <div className="group bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col h-full">
        {/* Time Badge */}
        <div className="flex justify-between items-start mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${timeOfDay.color} flex items-center space-x-1`}>
            <span>{timeOfDay.icon}</span>
            <span>{timeOfDay.label}</span>
          </div>
          <div className="p-1 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
            <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
          
        {/* Time Section */}
        <div className="flex-1 mb-6">
          <div className="bg-gray-50 rounded-xl p-4 group-hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-600">Horaire</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-bold text-gray-900 text-xl">
                  {formatTime(startDate)}
                </span>
                <span className="text-gray-400 font-medium">-</span>
                <span className="font-bold text-gray-900 text-xl">
                  {formatTime(endDate)}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500 font-medium">
                {Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} minutes
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleBook}
          disabled={loading}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Réservation...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Réserver ce créneau</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
