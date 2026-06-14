import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import FavoritesPage from './FavoritesPage';
import { rootReducer } from '../store/rootReducer';
import { AuthorizationStatus, AuthInfo } from '../types/auth';
import { NameSpace } from '../types/namespace';
import { createAPI } from '../utils/api';
import { makeMockOffer, makeMockAuthInfo } from '../utils/mock';
import { Offer } from '../types/offer';

const api = createAPI();
const mockAPI = new MockAdapter(api);

const makeStore = (
  favorites: Offer[] = [],
  userData: AuthInfo | null = null,
  authorizationStatus = AuthorizationStatus.Auth,
) =>
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
        favoriteOffers: favorites,
        currentOffer: null,
        nearbyOffers: [],
        reviews: [],
      },
      [NameSpace.User]: { authorizationStatus, userData },
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: api } }),
  });

const renderFavoritesPage = (
  favorites: Offer[] = [],
  userData: AuthInfo | null = null,
) =>
  render(
    <Provider store={makeStore(favorites, userData)}>
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    </Provider>,
  );

describe('FavoritesPage', () => {
  beforeEach(() => {
    mockAPI.reset();
    mockAPI.onGet('/favorite').reply(200, []);
  });

  it('should render "Nothing yet saved" when favorites list is empty', () => {
    renderFavoritesPage();
    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
  });

  it('should render saved listing title when favorites exist', () => {
    const offer = makeMockOffer();
    mockAPI.onGet('/favorite').reply(200, [offer]);
    renderFavoritesPage([offer]);
    expect(screen.getByText('Saved listing')).toBeInTheDocument();
  });

  it('should render offer cards when favorites exist', () => {
    const offer = makeMockOffer();
    mockAPI.onGet('/favorite').reply(200, [offer]);
    renderFavoritesPage([offer]);
    expect(screen.getAllByText(offer.title).length).toBeGreaterThan(0);
  });

  it('should group offers by city', () => {
    const offer1 = {
      ...makeMockOffer(),
      city: {
        name: 'Paris',
        location: { latitude: 48.85, longitude: 2.35, zoom: 12 },
      },
    };
    const offer2 = {
      ...makeMockOffer(),
      city: {
        name: 'Amsterdam',
        location: { latitude: 52.38, longitude: 4.9, zoom: 12 },
      },
    };
    mockAPI.onGet('/favorite').reply(200, [offer1, offer2]);
    renderFavoritesPage([offer1, offer2]);
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
  });

  it('should show user email in header when authorized', () => {
    const userData = makeMockAuthInfo();
    const offer = makeMockOffer();
    mockAPI.onGet('/favorite').reply(200, [offer]);
    render(
      <Provider store={makeStore([offer], userData, AuthorizationStatus.Auth)}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText(userData.email)).toBeInTheDocument();
  });
});
