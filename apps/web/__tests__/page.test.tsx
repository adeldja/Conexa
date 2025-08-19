import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Home from '../src/app/page';
import { useAuth } from '../src/contexts/AuthContext';

// Mock du router Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock du contexte d'authentification
jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Home page', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();
  });

  it('affiche un indicateur de chargement quand isLoading est true', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    render(<Home />);
    
    expect(screen.getByText('Conexa')).toBeInTheDocument();
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('redirige vers /dashboard quand l\'utilisateur est authentifié', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(<Home />);
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('redirige vers /login quand l\'utilisateur n\'est pas authentifié', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    render(<Home />);
    
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
