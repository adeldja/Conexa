import { useState } from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  labels?: string[];
  showValue?: boolean;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 1,
  max = 5,
  step = 1,
  disabled = false,
  labels = [],
  showValue = true,
  className = '',
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  const getLevelLabel = (level: number) => {
    if (labels.length > 0) {
      return labels[level - min] || `Niveau ${level}`;
    }

    // Labels par défaut pour les niveaux de compétence
    const defaultLabels = {
      1: 'Débutant',
      2: 'Intermédiaire',
      3: 'Confirmé',
      4: 'Avancé',
      5: 'Expert',
    };

    return defaultLabels[level as keyof typeof defaultLabels] || `Niveau ${level}`;
  };

  const getLevelColor = (level: number) => {
    const colors = {
      1: 'bg-red-500',
      2: 'bg-orange-500',
      3: 'bg-yellow-500',
      4: 'bg-blue-500',
      5: 'bg-green-500',
    };

    return colors[level as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Affichage de la valeur et du label */}
      {showValue && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{getLevelLabel(value)}</span>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getLevelColor(value)}`} />
            <span className="text-sm text-gray-500">
              {value}/{max}
            </span>
          </div>
        </div>
      )}

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          disabled={disabled}
          className={`
            w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            disabled:opacity-50 disabled:cursor-not-allowed
            slider
            ${isDragging ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
          `}
          style={{
            background: `linear-gradient(to right, ${getLevelColor(value).replace('bg-', '')} 0%, ${getLevelColor(value).replace('bg-', '')} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />

        {/* Track personnalisé */}
        <div className="absolute top-0 left-0 h-2 bg-gray-200 rounded-lg w-full pointer-events-none" />
        <div
          className={`absolute top-0 left-0 h-2 rounded-lg pointer-events-none transition-all duration-150 ${getLevelColor(value)}`}
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb personnalisé */}
        <div
          className={`
            absolute top-1/2 w-5 h-5 bg-white border-2 rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 pointer-events-none
            transition-all duration-150
            ${isDragging ? 'scale-110' : 'scale-100'}
            ${getLevelColor(value).replace('bg-', 'border-')}
          `}
          style={{ left: `${percentage}%` }}
        />
      </div>

      {/* Labels de niveaux (optionnel) */}
      <div className="flex justify-between text-xs text-gray-400 px-1">
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(level => (
          <span key={level} className="text-center">
            {level}
          </span>
        ))}
      </div>
    </div>
  );
}

// Composant spécialisé pour les niveaux de compétence
interface SkillLevelSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function SkillLevelSlider({ value, onChange, disabled, className }: SkillLevelSliderProps) {
  return (
    <Slider
      value={value}
      onChange={onChange}
      min={1}
      max={5}
      disabled={disabled}
      className={className}
      labels={['Débutant', 'Intermédiaire', 'Confirmé', 'Avancé', 'Expert']}
    />
  );
}
