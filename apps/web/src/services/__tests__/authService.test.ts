import { authService } from '../auth';
import { LoginRequest, RegisterRequest } from '@/types/auth';

// Mock fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage mock
    const localStorageMock = global.localStorage as jest.Mocked<typeof localStorage>;
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  describe('login', () => {
    it('devrait retourner un token valide pour des identifiants corrects', async () => {
      // Arrange
      const credentials: LoginRequest = {
        email: 'test@conexa.com',
        password: 'password123',
      };
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@conexa.com',
          role: 'CLIENT',
          fullName: 'Test User',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      // Act
      const result = await authService.login(credentials);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(localStorage.setItem).toHaveBeenCalledWith('conexa_token', mockResponse.access_token);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        })
      );
    });

    it('devrait lever une erreur pour des identifiants incorrects', async () => {
      // Arrange
      const credentials: LoginRequest = {
        email: 'wrong@test.com',
        password: 'wrongpass',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid credentials' }),
      } as Response);

      // Act & Assert
      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');
    });

    it('devrait gérer les erreurs de réseau', async () => {
      // Arrange
      const credentials: LoginRequest = {
        email: 'test@test.com',
        password: 'password',
      };
      mockFetch.mockRejectedValueOnce(new Error('Network Error'));

      // Act & Assert
      await expect(authService.login(credentials)).rejects.toThrow('Network Error');
    });
  });

  describe('register', () => {
    it('devrait créer un nouvel utilisateur avec succès', async () => {
      // Arrange
      const userData: RegisterRequest = {
        email: 'newuser@conexa.com',
        password: 'password123',
        fullName: 'Nouvel Utilisateur',
        role: 'CLIENT',
      };
      const mockResponse = {
        user: {
          id: '2',
          email: userData.email,
          fullName: userData.fullName,
          role: userData.role,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        access_token: 'new-token',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      // Act
      const result = await authService.register(userData);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
      );
    });

    it('devrait rejeter un email déjà existant', async () => {
      // Arrange
      const userData: RegisterRequest = {
        email: 'existing@conexa.com',
        password: 'password123',
        fullName: 'Utilisateur Existant',
        role: 'CLIENT',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ message: 'Email already exists' }),
      } as Response);

      // Act & Assert
      await expect(authService.register(userData)).rejects.toThrow('Email already exists');
    });
  });

  describe('logout', () => {
    it('devrait supprimer le token du localStorage', () => {
      // Arrange
      localStorage.setItem('conexa_token', 'test-token');
      localStorage.setItem('conexa_user', '{"id":"1","email":"test@test.com"}');

      // Act
      authService.logout();

      // Assert
      expect(localStorage.removeItem).toHaveBeenCalledWith('conexa_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('conexa_user');
    });
  });

  describe('getProfile', () => {
    it('devrait retourner les informations utilisateur', async () => {
      // Arrange
      const mockUser = {
        id: '1',
        email: 'test@conexa.com',
        fullName: 'Test User',
        role: 'CLIENT',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      // Mock localStorage pour retourner un token
      const mockToken = 'valid-token';
      jest.mocked(localStorage.getItem).mockImplementation(key => {
        if (key === 'conexa_token') return mockToken;
        return null;
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      } as Response);

      // Act
      const result = await authService.getProfile();

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/profile'),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer valid-token',
          },
        })
      );
    });

    it("devrait gérer le cas où aucun token n'est présent", async () => {
      // Arrange - localStorage.getItem retourne déjà null par défaut

      // Act & Assert
      await expect(authService.getProfile()).rejects.toThrow('Non authentifié');
    });

    it("devrait gérer les erreurs de l'API", async () => {
      // Arrange
      jest.mocked(localStorage.getItem).mockImplementation(key => {
        if (key === 'conexa_token') return 'invalid-token';
        return null;
      });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Token invalide' }),
      } as Response);

      // Act & Assert
      await expect(authService.getProfile()).rejects.toThrow('Session expirée');
    });
  });

  describe('Token management', () => {
    it('devrait stocker et récupérer le token', () => {
      // Arrange
      const testToken = 'test-token';

      // Mock localStorage.getItem pour retourner le token
      jest.mocked(localStorage.getItem).mockImplementation(key => {
        if (key === 'conexa_token') return testToken;
        return null;
      });

      // Act
      authService.setToken(testToken);
      const token = authService.getToken();

      // Assert
      expect(token).toBe(testToken);
      expect(localStorage.setItem).toHaveBeenCalledWith('conexa_token', testToken);
    });

    it("devrait retourner null si aucun token n'est stocké", () => {
      // localStorage.getItem retourne déjà null par défaut

      // Act
      const token = authService.getToken();

      // Assert
      expect(token).toBeNull();
    });

    it("devrait vérifier l'authentification", () => {
      // Test non authentifié - localStorage.getItem retourne null par défaut
      expect(authService.isAuthenticated()).toBe(false);

      // Test authentifié
      const testToken = 'test-token';
      jest.mocked(localStorage.getItem).mockImplementation(key => {
        if (key === 'conexa_token') return testToken;
        return null;
      });

      authService.setToken(testToken);
      expect(authService.isAuthenticated()).toBe(true);
    });
  });

  describe('User management', () => {
    it("devrait stocker et récupérer l'utilisateur", () => {
      // Arrange
      const user = {
        id: '1',
        email: 'test@test.com',
        fullName: 'Test User',
        role: 'CLIENT' as const,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      // Mock localStorage.getItem pour retourner l'utilisateur
      jest.mocked(localStorage.getItem).mockImplementation(key => {
        if (key === 'conexa_user') return JSON.stringify(user);
        return null;
      });

      // Act
      authService.setUser(user);
      const retrievedUser = authService.getUser();

      // Assert
      expect(retrievedUser).toEqual(user);
      expect(localStorage.setItem).toHaveBeenCalledWith('conexa_user', JSON.stringify(user));
    });

    it("devrait retourner null si aucun utilisateur n'est stocké", () => {
      // localStorage.getItem retourne déjà null par défaut

      // Act
      const user = authService.getUser();

      // Assert
      expect(user).toBeNull();
    });
  });
});
