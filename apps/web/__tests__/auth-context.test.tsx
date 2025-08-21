import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

// Composant de test pour utiliser le contexte
function TestComponent() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Connecté' : 'Non connecté'}</div>
      {user && <div data-testid="user-email">{user.email}</div>}
    </div>
  );
}

describe('AuthContext', () => {
  it("fournit un contexte d'authentification fonctionnel", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Vérifie que le contexte est accessible
    expect(screen.getByTestId('auth-status')).toBeInTheDocument();
  });
});
