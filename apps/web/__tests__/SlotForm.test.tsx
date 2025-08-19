import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SlotForm from '../src/components/slots/SlotForm';
import { availabilityService } from '../src/services/availability';
import { AuthProvider } from '../src/contexts/AuthContext';

// Mock du service
jest.mock('../src/services/availability');
const mockAvailabilityService = availabilityService as jest.Mocked<typeof availabilityService>;

// Mock du hook d'authentification
jest.mock('../src/contexts/AuthContext', () => ({
  ...jest.requireActual('../src/contexts/AuthContext'),
  useAuth: jest.fn(() => ({
    user: {
      id: 'provider1',
      email: 'provider@example.com',
      fullName: 'Test Provider',
      role: 'PROVIDER',
      createdAt: '2025-01-01',
    },
    isLoading: false,
    isAuthenticated: true,
  })),
}));

describe('SlotForm Component', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock pour les méthodes de formatage des dates
    mockAvailabilityService.formatTimeForInput.mockImplementation((date) => {
      return new Date(date).toISOString().slice(0, 16);
    });
  });

  it('renders the form for creating a new slot', () => {
    render(
      <AuthProvider>
        <SlotForm
          slot={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </AuthProvider>
    );

    expect(screen.getByText('Créer un nouveau créneau')).toBeInTheDocument();
    expect(screen.getByLabelText(/Date et heure de début/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date et heure de fin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Disponible pour réservation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Créer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument();
  });

  it('renders the form for editing an existing slot', () => {
    const mockSlot = {
      id: 'slot1',
      providerId: 'provider1',
      startTime: '2025-07-10T10:00:00.000Z',
      endTime: '2025-07-10T11:00:00.000Z',
      isAvailable: true,
      createdAt: '2025-07-01T10:00:00.000Z',
    };

    render(
      <AuthProvider>
        <SlotForm
          slot={mockSlot}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </AuthProvider>
    );

    expect(screen.getByText('Modifier le créneau')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mettre à jour/i })).toBeInTheDocument();
  });

  it('submits the form to create a new slot', async () => {
    mockAvailabilityService.createSlot.mockResolvedValue({
      id: 'new-slot',
      providerId: 'provider1',
      startTime: '2025-07-10T10:00:00.000Z',
      endTime: '2025-07-10T11:00:00.000Z',
      isAvailable: true,
      createdAt: '2025-07-03T09:00:00.000Z',
    });

    render(
      <AuthProvider>
        <SlotForm
          slot={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </AuthProvider>
    );

    // Simuler les changements dans le formulaire
    const startTimeInput = screen.getByLabelText(/Date et heure de début/i);
    const endTimeInput = screen.getByLabelText(/Date et heure de fin/i);

    fireEvent.change(startTimeInput, { target: { value: '2025-07-10T10:00' } });
    fireEvent.change(endTimeInput, { target: { value: '2025-07-10T11:00' } });

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole('button', { name: /Créer/i }));

    // Attendre que la soumission soit traitée
    await waitFor(() => {
      expect(mockAvailabilityService.createSlot).toHaveBeenCalledWith({
        providerId: 'provider1',
        startTime: expect.any(String),
        endTime: expect.any(String),
        isAvailable: true,
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('submits the form to update an existing slot', async () => {
    const mockSlot = {
      id: 'slot1',
      providerId: 'provider1',
      startTime: '2025-07-10T10:00:00.000Z',
      endTime: '2025-07-10T11:00:00.000Z',
      isAvailable: true,
      createdAt: '2025-07-01T10:00:00.000Z',
    };

    mockAvailabilityService.updateSlot.mockResolvedValue({
      ...mockSlot,
      isAvailable: false,
    });

    render(
      <AuthProvider>
        <SlotForm
          slot={mockSlot}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </AuthProvider>
    );

    // Changer la disponibilité
    const availableCheckbox = screen.getByLabelText(/Disponible pour réservation/i);
    fireEvent.click(availableCheckbox);

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole('button', { name: /Mettre à jour/i }));

    // Attendre que la soumission soit traitée
    await waitFor(() => {
      expect(mockAvailabilityService.updateSlot).toHaveBeenCalledWith(
        'slot1',
        expect.objectContaining({
          isAvailable: false,
        })
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('validates that end time is after start time', async () => {
    render(
      <AuthProvider>
        <SlotForm
          slot={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </AuthProvider>
    );

    // Définir une fin avant le début
    const startTimeInput = screen.getByLabelText(/Date et heure de début/i);
    const endTimeInput = screen.getByLabelText(/Date et heure de fin/i);

    fireEvent.change(startTimeInput, { target: { value: '2025-07-10T11:00' } });
    fireEvent.change(endTimeInput, { target: { value: '2025-07-10T10:00' } });

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole('button', { name: /Créer/i }));

    // Vérifier le message d'erreur
    await waitFor(() => {
      expect(screen.getByText(/L'heure de fin doit être postérieure à l'heure de début/i)).toBeInTheDocument();
    });

    expect(mockAvailabilityService.createSlot).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('handles API errors during submission', async () => {
    mockAvailabilityService.createSlot.mockRejectedValue(new Error('Erreur de création'));

    render(
      <AuthProvider>
        <SlotForm
          slot={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </AuthProvider>
    );

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole('button', { name: /Créer/i }));

    // Vérifier le message d'erreur
    await waitFor(() => {
      expect(screen.getByText(/Erreur de création/i)).toBeInTheDocument();
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <AuthProvider>
        <SlotForm
          slot={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
