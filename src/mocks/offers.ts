type OfferType = 'Apartment' | 'Room' | 'House' | 'Hotel';

export interface Offer {
  id: string;
  imagesSources: string[];
  title: string;
  descriptionBlocks: string;
  isPremium: boolean;
  type: OfferType;
  rating: number;
  bedroomsCount: number;
  maxAdults: number;
  price: number;
  inside: string[];
  host: {
    avatarUrl: string;
    name: string;
    isPro: boolean;
  };
}

export const mockOffers: Offer[] = [
  {
    id: '1',
    imagesSources: ['img/apartment-01.jpg'],
    title: 'Beautiful &amp; luxurious apartment at great location',
    descriptionBlocks: `A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.

An independent House, strategically located between Rembrand Square and National Opera, but where the bustle of the city comes to rest in this alley flowery and colorful.`,
    isPremium: true,
    type: 'Apartment',
    rating: 4.8,
    bedroomsCount: 3,
    maxAdults: 4,
    inside: [
      'Wi-Fi',
      'Washing machine',
      'Towels',
      'Heating',
      'Coffee machine',
      'Baby seat',
      'Kitchen',
      'Dishwasher',
      'Cabel TV',
      'Fridge',
    ],
    host: {
      avatarUrl: '/img/avatar-angelina.jpg',
      name: 'Angelina',
      isPro: true,
    },
    price: 120,
  },
  {
    id: '2',
    imagesSources: ['img/room.jpg'],
    title: 'Wood and stone place',
    descriptionBlocks: ``,
    isPremium: false,
    type: 'Room',
    rating: 4.8,
    bedroomsCount: 1,
    maxAdults: 1,
    inside: [
      'Wi-Fi',
      'Washing machine',
      'Towels',
      'Heating',
      'Coffee machine',
      'Baby seat',
    ],
    price: 80,
    host: {
      avatarUrl: '/img/avatar-angelina.jpg',
      name: 'Angelina',
      isPro: true,
    },
  },
  {
    id: '3',
    imagesSources: ['img/apartment-02.jpg'],
    title: 'Canal View Prinsengracht',
    descriptionBlocks: ``,
    isPremium: false,
    type: 'Apartment',
    rating: 4.8,
    bedroomsCount: 3,
    maxAdults: 4,
    inside: [
      'Wi-Fi',
      'Washing machine',
      'Towels',
      'Heating',
      'Coffee machine',
      'Baby seat',
    ],
    host: {
      avatarUrl: '/img/avatar-angelina.jpg',
      name: 'Angelina',
      isPro: true,
    },
    price: 132,
  },
  {
    id: '4',
    imagesSources: ['img/apartment-03.jpg'],
    title: 'Nice, cozy, warm big bed apartment',
    descriptionBlocks: ``,
    isPremium: true,
    type: 'Apartment',
    rating: 5,
    bedroomsCount: 2,
    maxAdults: 3,
    inside: [
      'Wi-Fi',
      'Washing machine',
      'Towels',
      'Heating',
      'Coffee machine',
      'Baby seat',
    ],
    host: {
      avatarUrl: '/img/avatar-angelina.jpg',
      name: 'Angelina',
      isPro: true,
    },
    price: 180,
  },
];
