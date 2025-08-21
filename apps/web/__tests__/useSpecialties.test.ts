import { renderHook, waitFor, act } from '@testing-library/react';
import { useSpecialties } from '../src/hooks/useSpecialties';
import { specialtyService } from '../src/services/specialtyService';

// Mock des dépendances
jest.mock('../src/services/specialtyService');
jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));
jest.mock('../src/components/ui', () => ({
  useToast: jest.fn(),
}));

const mockSpecialtyService = specialtyService as jest.Mocked<typeof specialtyService>;
const mockUseAuth = require('../src/contexts/AuthContext').useAuth as jest.MockedFunction<any>;
const mockUseToast = require('../src/components/ui').useToast as jest.MockedFunction<any>;

describe('useSpecialties', () => {
  const mockToast = {
    toasts: [],
    addToast: jest.fn(),
    removeToast: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  };

  const mockUser = {
    id: 'user123',
    email: 'test@test.com',
    fullName: 'Test User',
    role: 'PROVIDER' as const,
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockImplementation(() => ({
      user: mockUser,
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      refreshUser: jest.fn(),
      isLoading: false,
    }));

    mockUseToast.mockImplementation(() => mockToast);
  });

  it('charge les spécialités au montage', async () => {
    const mockAllSpecialties = [
      {
        id: '1',
        name: 'Cardiologie',
        description: 'Spécialité du cœur',
        createdAt: '2024-01-01T00:00:00.000Z',
        _count: { providers: 5 },
      },
      {
        id: '2',
        name: 'Neurologie',
        description: 'Spécialité du cerveau',
        createdAt: '2024-01-01T00:00:00.000Z',
        _count: { providers: 3 },
      },
    ];

    const mockMySpecialties = [
      {
        id: '1',
        specialtyId: '1',
        providerId: 'user123',
        createdAt: '2024-01-01T00:00:00.000Z',
        specialty: {
          id: '1',
          name: 'Cardiologie',
          description: 'Spécialité du cœur',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      },
    ];

    mockSpecialtyService.getAll.mockResolvedValue(mockAllSpecialties);
    mockSpecialtyService.getProviderSpecialties.mockResolvedValue(mockMySpecialties);

    const { result } = renderHook(() => useSpecialties());

    // État initial
    expect(result.current.loading).toBe(true);
    expect(result.current.allSpecialties).toEqual([]);

    // Attendre que les données soient chargées
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.allSpecialties).toEqual(mockAllSpecialties);
    expect(result.current.mySpecialties).toEqual(mockMySpecialties);
    expect(mockSpecialtyService.getAll).toHaveBeenCalledTimes(1);
    expect(mockSpecialtyService.getProviderSpecialties).toHaveBeenCalledWith('user123');
  });

  it('gère les erreurs de chargement', async () => {
    const errorMessage = 'Erreur de réseau';
    mockSpecialtyService.getAll.mockRejectedValue(new Error(errorMessage));
    mockSpecialtyService.getProviderSpecialties.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useSpecialties());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.allSpecialties).toEqual([]);
    expect(result.current.mySpecialties).toEqual([]);
    expect(mockToast.error).toHaveBeenCalledWith(
      'Erreur de chargement',
      'Impossible de charger les spécialités'
    );
  });

  it("ne charge pas les données si l'utilisateur n'est pas connecté", async () => {
    mockUseAuth.mockImplementation(() => ({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      refreshUser: jest.fn(),
      isLoading: false,
    }));

    const { result } = renderHook(() => useSpecialties());

    // Sans utilisateur, loading reste true et aucun appel API n'est fait
    expect(result.current.loading).toBe(true);
    expect(mockSpecialtyService.getAll).not.toHaveBeenCalled();
    expect(mockSpecialtyService.getProviderSpecialties).not.toHaveBeenCalled();
  });

  it('filtre les spécialités selon la recherche', async () => {
    const mockAllSpecialties = [
      {
        id: '1',
        name: 'Cardiologie',
        description: 'Spécialité du cœur',
        createdAt: '2024-01-01T00:00:00.000Z',
        _count: { providers: 5 },
      },
      {
        id: '2',
        name: 'Neurologie',
        description: 'Spécialité du cerveau',
        createdAt: '2024-01-01T00:00:00.000Z',
        _count: { providers: 3 },
      },
    ];

    mockSpecialtyService.getAll.mockResolvedValue(mockAllSpecialties);
    mockSpecialtyService.getProviderSpecialties.mockResolvedValue([]);

    const { result } = renderHook(() => useSpecialties());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Test de la recherche avec act()
    act(() => {
      result.current.setSearchQuery('cardio');
    });

    await waitFor(() => {
      expect(result.current.searchQuery).toBe('cardio');
    });
  });
});
