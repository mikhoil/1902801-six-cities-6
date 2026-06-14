import { Review } from '../types/review';

export const reviews: Review[] = [
  {
    id: '1',
    user: {
      name: 'Max',
      avatarUrl: 'img/avatar-max.jpg',
      isPro: false,
    },
    rating: 4,
    comment:
      'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
    date: '2019-04-24T00:00:00.000Z',
  },
  {
    id: '2',
    user: {
      name: 'Anna',
      avatarUrl: 'img/avatar-angelina.jpg',
      isPro: true,
    },
    rating: 5,
    comment:
      'Perfectly located between the main tourist attractions. The apartment is very clean and cozy. Highly recommended!',
    date: '2023-10-12T00:00:00.000Z',
  },
];
