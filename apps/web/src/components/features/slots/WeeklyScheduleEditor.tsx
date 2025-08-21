'use client';

import { useState } from 'react';
import {
  WeeklySchedule,
  DaySchedule,
  TimeSlot,
  DAYS_OF_WEEK,
  DEFAULT_WEEKLY_SCHEDULE,
} from '@/types/types';

interface WeeklyScheduleEditorProps {
  schedule: WeeklySchedule;
  onScheduleChange: (schedule: WeeklySchedule) => void;
  onGenerateSlots: (startDate?: Date, weekCount?: number) => Promise<void>;
  isLoading?: boolean;
}

export default function WeeklyScheduleEditor({
  schedule,
  onScheduleChange,
  onGenerateSlots,
  isLoading = false,
}: WeeklyScheduleEditorProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const handleGenerateSlots = async () => {
    // Générer pour les 4 prochaines semaines à partir d'aujourd'hui
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // Commencer à minuit
    await onGenerateSlots(startDate, 4);
  };

  const updateDayEnabled = (dayKey: string, enabled: boolean) => {
    const newSchedule = {
      ...schedule,
      [dayKey]: {
        ...schedule[dayKey],
        enabled,
        timeSlots: enabled
          ? schedule[dayKey].timeSlots.length > 0
            ? schedule[dayKey].timeSlots
            : [{ start: '09:00', end: '17:00' }]
          : [],
      },
    };
    onScheduleChange(newSchedule);
  };

  const updateTimeSlot = (
    dayKey: string,
    slotIndex: number,
    field: 'start' | 'end',
    value: string
  ) => {
    const newSchedule = { ...schedule };
    newSchedule[dayKey].timeSlots[slotIndex][field] = value;
    onScheduleChange(newSchedule);
  };

  const addTimeSlot = (dayKey: string) => {
    const newSchedule = { ...schedule };
    newSchedule[dayKey].timeSlots.push({ start: '09:00', end: '17:00' });
    onScheduleChange(newSchedule);
  };

  const removeTimeSlot = (dayKey: string, slotIndex: number) => {
    const newSchedule = { ...schedule };
    newSchedule[dayKey].timeSlots.splice(slotIndex, 1);
    onScheduleChange(newSchedule);
  };

  const applyToAllDays = () => {
    const enabledDays = Object.values(schedule).filter(day => day.enabled);
    if (enabledDays.length === 0) return;

    const templateDay = enabledDays[0];
    const newSchedule = { ...schedule };

    DAYS_OF_WEEK.forEach(({ key }) => {
      if (newSchedule[key].enabled) {
        newSchedule[key].timeSlots = [...templateDay.timeSlots];
      }
    });

    onScheduleChange(newSchedule);
  };

  const resetSchedule = () => {
    onScheduleChange(DEFAULT_WEEKLY_SCHEDULE);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Configuration des horaires hebdomadaires
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={applyToAllDays}
            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Appliquer à tous
          </button>
          <button
            onClick={resetSchedule}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {DAYS_OF_WEEK.map(({ key, name }) => {
          const daySchedule = schedule[key];
          const isExpanded = expandedDay === key;

          return (
            <div key={key} className="border border-slate-200 rounded-lg">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50"
                onClick={() => setExpandedDay(isExpanded ? null : key)}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={daySchedule.enabled}
                    onChange={e => {
                      e.stopPropagation();
                      updateDayEnabled(key, e.target.checked);
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium text-slate-900">{name}</span>
                  {daySchedule.enabled && (
                    <span className="text-sm text-slate-500">
                      {daySchedule.timeSlots.length} plage
                      {daySchedule.timeSlots.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <svg
                  className={`w-5 h-5 text-slate-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {isExpanded && daySchedule.enabled && (
                <div className="border-t border-slate-200 p-4 bg-slate-50">
                  <div className="space-y-3">
                    {daySchedule.timeSlots.map((timeSlot, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Début
                            </label>
                            <input
                              type="time"
                              value={timeSlot.start}
                              onChange={e => updateTimeSlot(key, index, 'start', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Fin
                            </label>
                            <input
                              type="time"
                              value={timeSlot.end}
                              onChange={e => updateTimeSlot(key, index, 'end', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        {daySchedule.timeSlots.length > 1 && (
                          <button
                            onClick={() => removeTimeSlot(key, index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      onClick={() => addTimeSlot(key)}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 border-dashed"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span>Ajouter une plage horaire</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <button
          onClick={handleGenerateSlots}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Génération en cours...
            </>
          ) : (
            'Générer les créneaux pour les 4 prochaines semaines'
          )}
        </button>
        <p className="text-sm text-slate-500 mt-2 text-center">
          Les créneaux seront générés toutes les 30 minutes selon vos horaires
        </p>
      </div>
    </div>
  );
}
