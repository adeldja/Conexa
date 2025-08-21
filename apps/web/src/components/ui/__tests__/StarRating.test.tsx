import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { StarRating } from '../StarRating'

describe('StarRating', () => {
  it('affiche le bon nombre d\'étoiles', () => {
    render(<StarRating rating={3} maxRating={5} />)
    
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(5)
  })

  it('affiche les étoiles pleines selon le rating', () => {
    render(<StarRating rating={3} maxRating={5} />)
    
    const buttons = screen.getAllByRole('button')
    // Vérifier que les 3 premières étoiles sont remplies (couleur jaune)
    const filledStars = buttons.slice(0, 3)
    filledStars.forEach(star => {
      const svg = star.querySelector('svg')
      expect(svg).toHaveClass('text-yellow-400')
    })
  })

  it('permet la sélection quand variant="interactive"', () => {
    const onRatingChange = jest.fn()
    render(<StarRating rating={2} maxRating={5} variant="interactive" onRatingChange={onRatingChange} />)
    
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[3]) // Clic sur la 4ème étoile
    
    expect(onRatingChange).toHaveBeenCalledWith(4)
  })

  it('n\'est pas interactive par défaut (variant="display")', () => {
    render(<StarRating rating={3} maxRating={5} />)
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })

  it('affiche le rating en texte quand variant="display"', () => {
    render(<StarRating rating={3.5} maxRating={5} variant="display" />)
    
    expect(screen.getByText('3.5')).toBeInTheDocument()
  })

  it('applique la bonne taille', () => {
    render(<StarRating rating={3} maxRating={5} size="lg" />)
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveClass('w-6', 'h-6')
    })
  })

  it('gère les demi-étoiles', () => {
    render(<StarRating rating={3.5} maxRating={5} />)
    
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(5)
    
    // La 4ème étoile devrait avoir un gradient (demi-étoile)
    const fourthStar = buttons[3]
    const svg = fourthStar.querySelector('svg')
    expect(svg?.querySelector('defs')).toBeInTheDocument()
  })
})