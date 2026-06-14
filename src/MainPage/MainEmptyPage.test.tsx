import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MainEmpty from './MainEmptyPage';

describe('MainEmpty', () => {
  it('should render "No places to stay available" heading', () => {
    render(<MainEmpty city="Paris" />);
    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
  });

  it('should render city name in description', () => {
    render(<MainEmpty city="Amsterdam" />);
    expect(
      screen.getByText(
        /We could not find any property available at the moment in Amsterdam/,
      ),
    ).toBeInTheDocument();
  });

  it('should render empty right section', () => {
    const { container } = render(<MainEmpty city="Paris" />);
    expect(
      container.querySelector('.cities__right-section'),
    ).toBeInTheDocument();
  });
});
