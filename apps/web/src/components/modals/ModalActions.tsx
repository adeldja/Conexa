interface ModalActionsProps {
  onClose: () => void;
  onContact: () => void;
}

export default function ModalActions({ onClose, onContact }: ModalActionsProps) {
  return (
    <div className="mt-6 flex justify-end space-x-3">
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        Fermer
      </button>
      <button
        onClick={onContact}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        Contacter le client
      </button>
    </div>
  );
}
