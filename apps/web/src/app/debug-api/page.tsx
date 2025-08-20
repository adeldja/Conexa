'use client';

import { useDebugSpecialties } from '@/hooks/useDebugSpecialties';

export default function DebugPage() {
  const { data, error, loading } = useDebugSpecialties();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug API Connection</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="font-semibold mb-2">État</h2>
        <p>Loading: {loading ? 'Oui' : 'Non'}</p>
        <p>Erreur: {error ? 'Oui' : 'Non'}</p>
        <p>Données: {data && Array.isArray(data) ? `${data.length} spécialités` : 'Aucune'}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold">Erreur détectée:</h3>
          <p>Code: {(error as any).code}</p>
          <p>Message: {(error as any).message}</p>
          {(error as any).response && (
            <p>Status HTTP: {(error as any).response.status}</p>
          )}
        </div>
      )}

      {data && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <h3 className="font-bold">Données reçues:</h3>
          <pre className="mt-2 text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
