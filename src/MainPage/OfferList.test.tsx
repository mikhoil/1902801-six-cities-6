import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import OfferList from './OfferList';
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

describe('OfferList', () => {
  it('should render the correct number of offer cards', () => {
    const offers = [makeMockOffer(), makeMockOffer(), makeMockOffer()];
    const { container } = render(
      <Provider store={makeStore()}>
        <MemoryRouter>
          <OfferList
            offers={offers}
            activeOfferId={null}
            onActiveChange={vi.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelectorAll('.place-card')).toHaveLength(
      offers.length,
    );
  });

  it('should render empty list when no offers provided', () => {
    const { container } = render(
      <Provider store={makeStore()}>
        <MemoryRouter>
          <OfferList
            offers={[]}
            activeOfferId={null}
            onActiveChange={vi.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelectorAll('.place-card')).toHaveLength(0);
  });

  it('should mark active offer card', () => {
    const offers = [makeMockOffer(), makeMockOffer()];
    const activeOfferId = offers[0].id;
    const { container } = render(
      <Provider store={makeStore()}>
        <MemoryRouter>
          <OfferList
            offers={offers}
            activeOfferId={activeOfferId}
            onActiveChange={vi.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('.place-card--active')).toBeInTheDocument();
  });
});
