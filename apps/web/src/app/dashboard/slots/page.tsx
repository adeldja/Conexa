'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProviderRoute from '@/components/ProviderRoute';
import SlotList from '@/components/slots/SlotList';
import SlotForm from '@/components/slots/SlotForm';
import DeleteSlotModal from '@/components/slots/DeleteSlotModal';
import { Slot } from '@/services/availability';

export default function SlotsPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slotToDelete, setSlotToDelete] = useState<Slot | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddClick = () => {
    setSelectedSlot(null);
    setShowForm(true);
  };

  const handleEditSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    setShowForm(true);
  };

  const handleDeleteSlot = (slot: Slot) => {
    setSlotToDelete(slot);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedSlot(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedSlot(null);
  };

  const handleDeleteSuccess = () => {
    setSlotToDelete(null);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <ProviderRoute>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion de vos créneaux</h1>
          <button
            onClick={handleAddClick}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm"
          >
            Ajouter un créneau
          </button>
        </div>

        {showForm && (
          <div className="mb-6">
            <SlotForm
              slot={selectedSlot}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        <SlotList
          onEditSlot={handleEditSlot}
          onDeleteSlot={handleDeleteSlot}
          refreshTrigger={refreshTrigger}
        />

        <DeleteSlotModal
          slot={slotToDelete}
          isOpen={!!slotToDelete}
          onClose={() => setSlotToDelete(null)}
          onSuccess={handleDeleteSuccess}
        />
      </div>
    </ProviderRoute>
  );
}
