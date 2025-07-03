'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { availabilityService, Slot } from '@/services/availability';

interface SlotListProps {
  onEditSlot: (slot: Slot) => void;
  onDeleteSlot: (slot: Slot) => void;
  refreshTrigger: number;
}

export default function SlotList({ onEditSlot, onDeleteSlot, refreshTrigger }: SlotListProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSlots = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await availabilityService.getProviderSlots(user.id);
        setSlots(data);
      } catch (err) {
        setError('Erreur lors de la récupération des créneaux');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [user, refreshTrigger]);

  if (loading) {
    return (
      <div className="my-4 p-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="my-4 p-4 bg-gray-100 border border-gray-300 text-gray-700 rounded">
        Aucun créneau n'a été créé. Utilisez le formulaire ci-dessus pour ajouter votre premier créneau.
      </div>
    );
  }

  // Trier les créneaux par date
  const sortedSlots = [...slots].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div className="my-4">
      <h3 className="text-lg font-semibold mb-2">Vos créneaux</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Début</th>
              <th className="py-2 px-4 border-b text-left">Fin</th>
              <th className="py-2 px-4 border-b text-left">Disponible</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedSlots.map((slot) => {
              const startDate = new Date(slot.startTime);
              const endDate = new Date(slot.endTime);
              
              return (
                <tr key={slot.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {startDate.toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-bold 
                      ${slot.isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'}`}>
                      {slot.isAvailable ? 'Disponible' : 'Indisponible'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onEditSlot(slot)}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm"
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={() => onDeleteSlot(slot)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
