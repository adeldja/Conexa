import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card Component', () => {
  it('devrait afficher le contenu fourni', () => {
    render(
      <Card>
        <p>Contenu de test</p>
      </Card>
    );

    expect(screen.getByText('Contenu de test')).toBeInTheDocument();
  });

  it('devrait appliquer les classes CSS par défaut', () => {
    const { container } = render(<Card>Contenu</Card>);

    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('bg-white', 'rounded-2xl', 'transition-all', 'duration-200');
  });

  it('devrait appliquer les classes personnalisées', () => {
    const { container } = render(<Card className="custom-class">Contenu</Card>);

    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('custom-class');
  });

  it('devrait gérer les événements de clic', () => {
    const handleClick = jest.fn();

    render(<Card onClick={handleClick}>Contenu cliquable</Card>);

    const cardElement = screen.getByText('Contenu cliquable');
    cardElement.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
