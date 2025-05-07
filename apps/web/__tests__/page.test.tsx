import { render } from '@testing-library/react';
import Home from '../src/app/page';

describe('Home page', () => {
  it('affiche le logo Next.js', () => {
    const { getByAltText } = render(<Home />);
    expect(getByAltText(/Next\.js logo/i)).toBeInTheDocument();
  });

  it('invite à éditer src/app/page.tsx', () => {
    const { getByText } = render(<Home />);
    expect(getByText(/Get started by editing/i)).toBeInTheDocument();
  });
});
