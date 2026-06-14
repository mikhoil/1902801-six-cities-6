import { City } from '../types/city';

export const mockCities: City[] = [
  {
    name: 'Paris',
    location: { latitude: 48.85341, longitude: 2.3488, zoom: 12 },
  },
  {
    name: 'Cologne',
    location: { latitude: 50.938361, longitude: 6.959974, zoom: 12 },
  },
  {
    name: 'Brussels',
    location: { latitude: 50.846557, longitude: 4.351697, zoom: 12 },
  },
  {
    name: 'Amsterdam',
    location: { latitude: 52.38333, longitude: 4.9, zoom: 12 },
  },
  {
    name: 'Hamburg',
    location: { latitude: 53.550341, longitude: 10.000654, zoom: 12 },
  },
  {
    name: 'Dusseldorf',
    location: { latitude: 51.225402, longitude: 6.776314, zoom: 12 },
  },
];

export const mockCityNames = mockCities.map((city) => city.name);

export const getCityByName = (name: string): City =>
  mockCities.find((city) => city.name === name) ?? mockCities[0];
