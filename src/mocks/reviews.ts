interface Review {
  id: string;
  author: {
    avatarUrl: string;
    name: string;
  };
  createdAt: string;
  mark: number;
  text: string;
  offerId: string;
}

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    author: {
      avatarUrl: '/img/avatar-max.jpg',
      name: 'Max',
    },
    createdAt: 'April 2019',
    mark: 4,
    text: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
    offerId: 'offer-1',
  },
];
