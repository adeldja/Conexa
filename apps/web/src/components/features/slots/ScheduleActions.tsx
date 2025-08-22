import { WeeklySchedule, DEFAULT_WEEKLY_SCHEDULE } from '@/types/types';

interface ScheduleActionsProps {
  onApplyToAll: (timeSlot: { start: string; end: string }) => void;
  onReset: () => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export default function ScheduleActions({
  onApplyToAll,
  onReset,
  onGenerate,
  isLoading,
}: ScheduleActionsProps) {
  const handleApplyStandard = () => {
    onApplyToAll({ start: '09:00', end: '17:00' });
  };

  const handleApplyMorning = () => {
    onApplyToAll({ start: '08:00', end: '12:00' });
  };

  const handleApplyAfternoon = () => {
    onApplyToAll({ start: '14:00', end: '18:00' });
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-sm font-medium text-blue-900 mb-3">Actions rapides</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          onClick={handleApplyStandard}
          className="text-xs px-3 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
        >
          9h-17h tous les jours
        </button>

        <button
          onClick={handleApplyMorning}
          className="text-xs px-3 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Matinées (8h-12h)
        </button>

        <button
          onClick={handleApplyAfternoon}
          className="text-xs px-3 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Après-midi (14h-18h)
        </button>

        <button
          onClick={onReset}
          className="text-xs px-3 py-2 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
