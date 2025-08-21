import { render, screen } from '@testing-library/react';

// Test simple pour vérifier la configuration Jest
describe('Configuration Jest', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  it('devrait configurer Jest correctement', () => {
    // Test simple d'un élément DOM
    render(<div data-testid="test-element">Hello Test</div>);

    const element = screen.getByTestId('test-element');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Hello Test');
  });

  it('devrait mocker localStorage', () => {
    // Test du mock localStorage
    localStorage.setItem('test-key', 'test-value');

    expect(localStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
    expect(localStorage.getItem).toBeDefined();
  });

  it('devrait mocker fetch', () => {
    // Test du mock fetch
    expect(global.fetch).toBeDefined();
    expect(typeof global.fetch).toBe('function');
  });

  it("devrait avoir les variables d'environnement de test", () => {
    expect(process.env.NEXT_PUBLIC_API_URL).toBe('http://localhost:3001');
    expect(process.env.API_BASE_URL).toBe('http://localhost:3001');
  });
});
