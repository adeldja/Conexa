'use client';

import { GeneratedSlot } from '../../types/types';
import BaseModal from './BaseModal';
import SlotInfo from './SlotInfo';
import ClientInfo from './ClientInfo';
import ModalActions from './ModalActions';

interface SlotDetailsModalProps {
  slot: GeneratedSlot | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SlotDetailsModal({ slot, isOpen, onClose }: SlotDetailsModalProps) {
  console.log('🔧 Debug - SlotDetailsModal rendu:', { 
    isOpen, 
    slotId: slot?.id, 
    slotStatus: slot?.status,
    hasBooking: !!slot?.booking,
    bookingData: slot?.booking 
  });
  
  if (!isOpen || !slot || !slot.booking) {
    console.log('🔧 Debug - Modal fermée ou pas de booking');
    return null;
  }

  const handleContact = () => {
    window.open(`mailto:${slot.booking?.clientEmail}`, '_blank');
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Détails de la réservation"
    >
      <div className="space-y-4">
        <SlotInfo 
          date={slot.date}
          startTime={slot.startTime}
          endTime={slot.endTime}
        />
        
        <ClientInfo 
          clientName={slot.booking.clientName}
          clientEmail={slot.booking.clientEmail}
          clientPhone={slot.booking.clientPhone}
          notes={slot.booking.notes}
        />
      </div>

      <ModalActions 
        onClose={onClose}
        onContact={handleContact}
      />
    </BaseModal>
  );
}
