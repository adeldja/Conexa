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
  loading 
}: ProviderSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onProviderChange(e.target.value);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Sélectionnez un prestataire</h2>
      
      {loading ? (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="mb-4">
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedProviderId}
            onChange={handleChange}
          >
            <option value="">-- Sélectionnez un prestataire --</option>
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.fullName || provider.email}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
