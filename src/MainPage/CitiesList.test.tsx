import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CitiesList from './CitiesList';

const cities = ['Paris', 'Amsterdam', 'Brussels'];

describe('CityList', () => {
  it('should render all city names', () => {
    render(
      <CitiesList cities={cities} currentCity="Paris" onCityChange={vi.fn()} />,
    );
    cities.forEach((city) => {
      expect(screen.getByText(city)).toBeInTheDocument();
    });
  });

  it('should mark active city with active class', () => {
    const { container } = render(
      <CitiesList
        cities={cities}
        currentCity="Amsterdam"
        onCityChange={vi.fn()}
      />,
    );
    const links = container.querySelectorAll('.locations__item-link');
    const parisLink = Array.from(links).find((el) =>
      el.textContent?.includes('Paris'),
    );
    const amsterdamLink = Array.from(links).find((el) =>
      el.textContent?.includes('Amsterdam'),
    );

    expect(parisLink).not.toHaveClass('tabs__item--active');
    expect(amsterdamLink).toHaveClass('tabs__item--active');
  });

  it('should call onCityChange with correct city when city is clicked', () => {
    const handleCityChange = vi.fn();
    render(
      <CitiesList
        cities={cities}
        currentCity="Paris"
        onCityChange={handleCityChange}
      />,
    );
    fireEvent.click(screen.getByText('Amsterdam'));
    expect(handleCityChange).toHaveBeenCalledWith('Amsterdam');
    expect(handleCityChange).toHaveBeenCalledTimes(1);
  });

  it('should not call onCityChange for non-clicked cities', () => {
    const handleCityChange = vi.fn();
    render(
      <CitiesList
        cities={cities}
        currentCity="Paris"
        onCityChange={handleCityChange}
      />,
    );
    fireEvent.click(screen.getByText('Brussels'));
    expect(handleCityChange).not.toHaveBeenCalledWith('Paris');
    expect(handleCityChange).not.toHaveBeenCalledWith('Amsterdam');
  });
});
