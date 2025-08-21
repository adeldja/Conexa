import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteSlotModal from '../src/components/modals/DeleteSlotModal';
import { availabilityService } from '../src/services/availability';

// Mock du service
jest.mock('../src/services/availability');
const mockAvailabilityService = availabilityService as jest.Mocked<typeof availabilityService>;

describe('DeleteSlotModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  const mockSlot = {
    id: 'slot1',
    providerId: 'provider1',
    startTime: '2025-07-10T10:00:00.000Z',
    endTime: '2025-07-10T11:00:00.000Z',
    isAvailable: true,
    createdAt: '2025-07-01T10:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(
      <DeleteSlotModal
        slot={mockSlot}
        isOpen={false}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.queryByText(/Confirmer la suppression/i)).not.toBeInTheDocument();
  });

  it('does not render when slot is null', () => {
    render(
      <DeleteSlotModal slot={null} isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    expect(screen.queryByText(/Confirmer la suppression/i)).not.toBeInTheDocument();
  });

  it('renders correctly when isOpen is true and slot is provided', () => {
    render(
      <DeleteSlotModal
        slot={mockSlot}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText(/Confirmer la suppression/i)).toBeInTheDocument();
    expect(screen.getByText(/Êtes-vous sûr de vouloir supprimer le créneau/i)).toBeInTheDocument();
    expect(screen.getByText(/10\/07\/2025/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Supprimer/i })).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <DeleteSlotModal
        slot={mockSlot}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls deleteSlot and onSuccess when delete button is clicked', async () => {
    mockAvailabilityService.deleteSlot.mockResolvedValue(undefined);

    render(
      <DeleteSlotModal
        slot={mockSlot}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Supprimer/i }));

    await waitFor(() => {
      expect(mockAvailabilityService.deleteSlot).toHaveBeenCalledWith(mockSlot.id);
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message when deletion fails', async () => {
    mockAvailabilityService.deleteSlot.mockRejectedValue(
      new Error('Erreur lors de la suppression')
    );

    render(
      <DeleteSlotModal
        slot={mockSlot}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Supprimer/i }));

    await waitFor(() => {
      expect(screen.getByText(/Erreur lors de la suppression/i)).toBeInTheDocument();
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('disables buttons during deletion process', async () => {
    // Simuler une opération qui ne se termine jamais
    mockAvailabilityService.deleteSlot.mockImplementation(() => new Promise(() => {}));

    render(
      <DeleteSlotModal
        slot={mockSlot}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Supprimer/i }));

    await waitFor(() => {
      expect(screen.getByText(/Suppression.../i)).toBeInTheDocument();
    });
  });
});
