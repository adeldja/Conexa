import { Provider } from '@/services/booking';

interface ProviderSelectorProps {
  providers: Provider[];
  selectedProviderId: string;
  onProviderChange: (providerId: string) => void;
  loading: boolean;
}

export default function ProviderSelector({
  providers,
  selectedProviderId,
  onProviderChange,
  loading,
}: ProviderSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onProviderChange(e.target.value);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-xl">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Sélectionnez votre prestataire</h2>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Chargement des prestataires...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Choisissez parmi nos prestataires disponibles
            </label>
            <div className="relative">
              <select
                className="w-full p-4 pr-12 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white font-medium"
                value={selectedProviderId}
                onChange={handleChange}
              >
                <option value="" className="text-gray-500">
                  -- Sélectionnez un prestataire --
                </option>
                {providers.map(provider => (
                  <option key={provider.id} value={provider.id} className="text-gray-900">
                    {provider.fullName || provider.email}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
