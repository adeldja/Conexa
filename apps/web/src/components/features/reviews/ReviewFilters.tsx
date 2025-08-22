interface ReviewFilters {
  rating?: string;
  period?: string;
}

interface ReviewFiltersProps {
  filters: ReviewFilters;
  onFiltersChange: (filters: ReviewFilters) => void;
  onApplyFilters: () => void;
}

export default function ReviewFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
}: ReviewFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Note minimum</label>
          <select
            value={filters.rating || ''}
            onChange={e => onFiltersChange({ ...filters, rating: e.target.value || undefined })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les notes</option>
            <option value="5">5 étoiles</option>
            <option value="4">4 étoiles et plus</option>
            <option value="3">3 étoiles et plus</option>
            <option value="2">2 étoiles et plus</option>
            <option value="1">1 étoile et plus</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
          <select
            value={filters.period || ''}
            onChange={e => onFiltersChange({ ...filters, period: e.target.value || undefined })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toute la période</option>
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">3 derniers mois</option>
            <option value="365">Dernière année</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={onApplyFilters}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Appliquer les filtres
          </button>
        </div>
      </div>
    </div>
  );
}
