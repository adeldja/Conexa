'use client';

import { useState } from 'react';
import { WeeklySchedule, DAYS_OF_WEEK, DEFAULT_WEEKLY_SCHEDULE } from '@/types/types';
import DayScheduleEditor from './DayScheduleEditor';
import ScheduleActions from './ScheduleActions';

interface WeeklyScheduleEditorProps {
  schedule: WeeklySchedule;
  onChange: (schedule: WeeklySchedule) => void;
  onGenerateSlots?: (startDate?: Date, weekCount?: number) => Promise<void>;
  isLoading?: boolean;
}

export default function WeeklyScheduleEditor({
  schedule,
  onChange,
  onGenerateSlots,
  isLoading = false,
}: WeeklyScheduleEditorProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const handleDayUpdate = (dayKey: string, daySchedule: any) => {
    const newSchedule = {
      ...schedule,
      [dayKey]: daySchedule,
    };
    onChange(newSchedule);
  };

  const handleToggleExpand = (dayKey: string) => {
    setExpandedDay(expandedDay === dayKey ? null : dayKey);
  };

  const handleApplyToAll = (timeSlot: { start: string; end: string }) => {
    const newSchedule = { ...schedule };

    DAYS_OF_WEEK.forEach(({ key }) => {
      newSchedule[key] = {
        ...newSchedule[key],
        enabled: true,
        timeSlots: [timeSlot],
      };
    });

    onChange(newSchedule);
  };

  const handleReset = () => {
    onChange(DEFAULT_WEEKLY_SCHEDULE);
    setExpandedDay(null);
  };

  const handleGenerate = async () => {
    if (!onGenerateSlots) return;

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    await onGenerateSlots(startDate, 4);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {DAYS_OF_WEEK.map(({ key, name }) => (
          <DayScheduleEditor
            key={key}
            dayKey={key}
            dayName={name}
            daySchedule={schedule[key]}
            isExpanded={expandedDay === key}
            onToggleExpand={() => handleToggleExpand(key)}
            onUpdateDay={handleDayUpdate}
          />
        ))}
      </div>

      <ScheduleActions
        onApplyToAll={handleApplyToAll}
        onReset={handleReset}
        onGenerate={handleGenerate}
        isLoading={isLoading}
      />
    </div>
  );
}
