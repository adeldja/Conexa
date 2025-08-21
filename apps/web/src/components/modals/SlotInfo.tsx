import { formatDate, formatTime } from '@/utils';

interface SlotInfoProps {
  date: string;
  startTime: string;
  endTime: string;
}

export default function SlotInfo({ date, startTime, endTime }: SlotInfoProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-2">Créneau</h4>
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <span className="font-medium">Date :</span> {formatDate(new Date(date))}
        </p>
        <p>
          <span className="font-medium">Heure :</span> {formatTime(new Date(startTime))} -{' '}
          {formatTime(new Date(endTime))}
        </p>
      </div>
    </div>
  );
}
