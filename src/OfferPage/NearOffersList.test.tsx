import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import NearPlacesList from './NearOffersList';
import { rootReducer } from '../store/rootReducer';
import { AuthorizationStatus } from '../types/auth';
import { NameSpace } from '../types/namespace';
import { makeMockOffer } from '../utils/mock';

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      [NameSpace.App]: {
        city: 'Paris',
        isOffersLoading: false,
        isOfferLoading: false,
      },
      [NameSpace.Data]: {
        offers: [],
        favoriteOffers: [],
        currentOffer: null,
        nearbyOffers: [],
        reviews: [],
      },
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        userData: null,
      },
    },
  });

describe('NearPlacesList', () => {
  it('should render the correct number of near-places cards', () => {
    const offers = [makeMockOffer(), makeMockOffer()];
    const { container } = render(
      <Provider store={makeStore()}>
        <MemoryRouter>
          <NearPlacesList offers={offers} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelectorAll('.near-places__card')).toHaveLength(
      offers.length,
    );
  });

  it('should render empty list when no offers provided', () => {
    const { container } = render(
      <Provider store={makeStore()}>
        <MemoryRouter>
          <NearPlacesList offers={[]} />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelectorAll('.near-places__card')).toHaveLength(0);
  });
});
