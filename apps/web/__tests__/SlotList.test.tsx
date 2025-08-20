import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SlotList from '../src/components/features/slots/SlotList';
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

describe('SlotList Component', () => {
  const mockOnEditSlot = jest.fn();
  const mockOnDeleteSlot = jest.fn();
  
  const mockSlots = [
    {
      id: 'slot1',
      providerId: 'provider1',
      startTime: '2025-07-10T10:00:00.000Z',
      endTime: '2025-07-10T11:00:00.000Z',
      isAvailable: true,
      createdAt: '2025-07-01T10:00:00.000Z',
    },
    {
      id: 'slot2',
      providerId: 'provider1',
      startTime: '2025-07-11T14:00:00.000Z',
      endTime: '2025-07-11T15:00:00.000Z',
      isAvailable: false,
      createdAt: '2025-07-01T11:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    mockAvailabilityService.getProviderSlots.mockReturnValue(new Promise(() => {})); // Promise non-résolue pour simuler le chargement

    render(
      <AuthProvider>
        <SlotList
          onEditSlot={mockOnEditSlot}
          onDeleteSlot={mockOnDeleteSlot}
          refreshTrigger={0}
        />
      </AuthProvider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument(); // Suppose que le spinner a un rôle de "status"
  });

  it('displays slots when data is loaded', async () => {
    mockAvailabilityService.getProviderSlots.mockResolvedValue(mockSlots);

    render(
      <AuthProvider>
        <SlotList
          onEditSlot={mockOnEditSlot}
          onDeleteSlot={mockOnDeleteSlot}
          refreshTrigger={0}
        />
      </AuthProvider>
    );

    // Attendre que les données soient chargées
    await waitFor(() => {
      expect(mockAvailabilityService.getProviderSlots).toHaveBeenCalledWith('provider1');
    });

    // Vérifier que les créneaux sont affichés
    expect(screen.getByText('10/07/2025')).toBeInTheDocument();
    expect(screen.getByText('11/07/2025')).toBeInTheDocument();
    
    // Vérifier les statuts de disponibilité
    const disponibleElements = screen.getAllByText(/^Disponible$/i);
    const indisponibleElement = screen.getByText(/^Indisponible$/i);
    expect(disponibleElements.length).toBeGreaterThan(0);
    expect(indisponibleElement).toBeInTheDocument();
  });

  it('shows a message when no slots are available', async () => {
    mockAvailabilityService.getProviderSlots.mockResolvedValue([]);

    render(
      <AuthProvider>
        <SlotList
          onEditSlot={mockOnEditSlot}
          onDeleteSlot={mockOnDeleteSlot}
          refreshTrigger={0}
        />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Aucun créneau n'a été créé/i)).toBeInTheDocument();
    });
  });

  it('calls onEditSlot when edit button is clicked', async () => {
    mockAvailabilityService.getProviderSlots.mockResolvedValue(mockSlots);

    render(
      <AuthProvider>
        <SlotList
          onEditSlot={mockOnEditSlot}
          onDeleteSlot={mockOnDeleteSlot}
          refreshTrigger={0}
        />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Modifier')[0]).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Modifier')[0]);
    expect(mockOnEditSlot).toHaveBeenCalledWith(mockSlots[0]);
  });

  it('calls onDeleteSlot when delete button is clicked', async () => {
    mockAvailabilityService.getProviderSlots.mockResolvedValue(mockSlots);

    render(
      <AuthProvider>
        <SlotList
          onEditSlot={mockOnEditSlot}
          onDeleteSlot={mockOnDeleteSlot}
          refreshTrigger={0}
        />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Supprimer')[0]).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Supprimer')[0]);
    expect(mockOnDeleteSlot).toHaveBeenCalledWith(mockSlots[0]);
  });

  it('handles API errors', async () => {
    mockAvailabilityService.getProviderSlots.mockRejectedValue(new Error('Erreur lors de la récupération des créneaux'));

    render(
      <AuthProvider>
        <SlotList
          onEditSlot={mockOnEditSlot}
          onDeleteSlot={mockOnDeleteSlot}
          refreshTrigger={0}
        />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Erreur lors de la récupération des créneaux/i)).toBeInTheDocument();
    });
  });

  it('refreshes data when refreshTrigger changes', async () => {
    mockAvailabilityService.getProviderSlots.mockResolvedValue(mockSlots);

    const { rerender } = render(
      <AuthProvider>
        <SlotList
          onEditSlot={mockOnEditSlot}
          onDeleteSlot={mockOnDeleteSlot}
          refreshTrigger={0}
        />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockAvailabilityService.getProviderSlots).toHaveBeenCalled();
    });

    mockAvailabilityService.getProviderSlots.mockClear();

    // Rerender with a different refreshTrigger
    rerender(
      <AuthProvider>
        <SlotList
          onEditSlot={mockOnEditSlot}
          onDeleteSlot={mockOnDeleteSlot}
          refreshTrigger={1}
        />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockAvailabilityService.getProviderSlots).toHaveBeenCalled();
    });
  });
});
