import { memo } from 'react';

interface CitiesListProps {
  currentCity: string;
  cities: string[];
  onCityChange: (city: string) => void;
}

function CitiesList({ currentCity, cities, onCityChange }: CitiesListProps) {
  return (
    <section className="locations container">
      <ul className="locations__list tabs__list">
        {cities.map((c) => (
          <li className="locations__item" key={c}>
            <a
              className={`locations__item-link tabs__item ${
                currentCity === c ? 'tabs__item--active' : ''
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onCityChange(c);
              }}
            >
              <span>{c}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default memo(CitiesList);
