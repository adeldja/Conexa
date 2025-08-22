import { DaySchedule, TimeSlot } from '@/types/types';

interface DayScheduleEditorProps {
  dayKey: string;
  dayName: string;
  daySchedule: DaySchedule;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateDay: (dayKey: string, schedule: DaySchedule) => void;
}

export default function DayScheduleEditor({
  dayKey,
  dayName,
  daySchedule,
  isExpanded,
  onToggleExpand,
  onUpdateDay,
}: DayScheduleEditorProps) {
  const updateEnabled = (enabled: boolean) => {
    const newSchedule: DaySchedule = {
      ...daySchedule,
      enabled,
      timeSlots: enabled
        ? daySchedule.timeSlots.length > 0
          ? daySchedule.timeSlots
          : [{ start: '09:00', end: '17:00' }]
        : [],
    };
    onUpdateDay(dayKey, newSchedule);
  };

  const updateTimeSlot = (index: number, field: 'start' | 'end', value: string) => {
    const newTimeSlots = [...daySchedule.timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };

    const newSchedule: DaySchedule = {
      ...daySchedule,
      timeSlots: newTimeSlots,
    };
    onUpdateDay(dayKey, newSchedule);
  };

  const addTimeSlot = () => {
    const lastSlot = daySchedule.timeSlots[daySchedule.timeSlots.length - 1];
    const newSlot: TimeSlot = {
      start: lastSlot ? lastSlot.end : '09:00',
      end: lastSlot ? '18:00' : '17:00',
    };

    const newSchedule: DaySchedule = {
      ...daySchedule,
      timeSlots: [...daySchedule.timeSlots, newSlot],
    };
    onUpdateDay(dayKey, newSchedule);
  };

  const removeTimeSlot = (index: number) => {
    const newTimeSlots = daySchedule.timeSlots.filter((_, i) => i !== index);
    const newSchedule: DaySchedule = {
      ...daySchedule,
      timeSlots: newTimeSlots,
    };
    onUpdateDay(dayKey, newSchedule);
  };

  return (
    <div className="border border-gray-200 rounded-lg">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={daySchedule.enabled}
              onChange={e => updateEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">{dayName}</span>
            {daySchedule.enabled && (
              <span className="text-sm text-gray-500">
                ({daySchedule.timeSlots.length} créneau{daySchedule.timeSlots.length > 1 ? 'x' : ''}
                )
              </span>
            )}
          </div>
          {daySchedule.enabled && (
            <button
              onClick={onToggleExpand}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {isExpanded ? 'Réduire' : 'Configurer'}
            </button>
          )}
        </div>
      </div>

      {daySchedule.enabled && isExpanded && (
        <div className="p-4 space-y-3">
          {daySchedule.timeSlots.map((timeSlot, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="time"
                value={timeSlot.start}
                onChange={e => updateTimeSlot(index, 'start', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-500">à</span>
              <input
                type="time"
                value={timeSlot.end}
                onChange={e => updateTimeSlot(index, 'end', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {daySchedule.timeSlots.length > 1 && (
                <button
                  onClick={() => removeTimeSlot(index)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer ce créneau"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addTimeSlot}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            + Ajouter un créneau
          </button>
        </div>
      )}
    </div>
  );
}
