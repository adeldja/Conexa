import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { authService } from '../src/services/auth';

// Mock du service auth
jest.mock('../src/services/auth');
const mockAuthService = authService as jest.Mocked<typeof authService>;

// Composant de test pour utiliser le contexte
const TestComponent = () => {
  const { isAuthenticated, login, register, logout, user } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login({ email: 'test@example.com', password: 'password' });
    } catch (error) {
      // Ignorer les erreurs pour les tests
    }
  };

  const handleRegister = async () => {
    try {
      await register({ email: 'test@example.com', password: 'password', fullName: 'Test User' });
    } catch (error) {
      // Ignorer les erreurs pour les tests
    }
  };
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'authenticated' : 'not-authenticated'}
      </div>
      {user && <div data-testid="user-email">{user.email}</div>}
      <button 
        onClick={handleLogin}
        data-testid="login-btn"
      >
        Login
      </button>
      <button 
        onClick={handleRegister}
        data-testid="register-btn"
      >
        Register
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
};

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true
});

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthService.getToken.mockReturnValue(null);
    mockAuthService.getUser.mockReturnValue(null);
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockAuthService.getProfile.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      role: 'CLIENT',
      createdAt: '2023-01-01'
    });
  });

  it('initialise avec un état non authentifié', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
  });

  it('effectue un login avec succès', async () => {
    const mockResponse = {
      user: { id: '1', email: 'test@example.com', fullName: 'Test User', role: 'CLIENT' as const, createdAt: '2023-01-01' },
      access_token: 'mock-token'
    };
    mockAuthService.login.mockResolvedValue(mockResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });

    expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
  });

  it('effectue un register avec succès', async () => {
    const mockResponse = {
      user: { id: '1', email: 'test@example.com', fullName: 'Test User', role: 'CLIENT' as const, createdAt: '2023-01-01' },
      access_token: 'mock-token'
    };
    mockAuthService.register.mockResolvedValue(mockResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('register-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });

    expect(mockAuthService.register).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password', fullName: 'Test User' });
  });

  it('effectue un logout', async () => {
    // Simuler un état initial authentifié
    mockAuthService.getToken.mockReturnValue('mock-token');
    mockAuthService.getUser.mockReturnValue({
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      role: 'CLIENT',
      createdAt: '2023-01-01'
    });
    mockAuthService.isAuthenticated.mockReturnValue(true);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Attendre que l'état initial soit défini
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    fireEvent.click(screen.getByTestId('logout-btn'));

    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('gère les erreurs de login', async () => {
    mockAuthService.login.mockRejectedValue(new Error('Login failed'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    });

    expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
  });
});
