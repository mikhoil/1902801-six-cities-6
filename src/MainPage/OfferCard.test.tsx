import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import OfferCard from './OfferCard';
import { rootReducer } from '../store/rootReducer';
import { AuthorizationStatus } from '../types/auth';
import { NameSpace } from '../types/namespace';
import { makeMockOffer } from '../utils/mock';
import { createAPI } from '../utils/api';
import { Offer } from '../types/offer';

const api = createAPI();
const mockAPI = new MockAdapter(api);

const makeStore = (
  authorizationStatus = AuthorizationStatus.Auth,
  offers = [makeMockOffer()],
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
        offers,
        favoriteOffers: [],
        currentOffer: null,
        nearbyOffers: [],
        reviews: [],
      },
      [NameSpace.User]: { authorizationStatus, userData: null },
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: api } }),
  });

const renderOfferCard = (
  offer = makeMockOffer(),
  status = AuthorizationStatus.Auth,
) =>
  render(
    <Provider store={makeStore(status, [offer])}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={<OfferCard offer={offer} classNamePrefix="cities" />}
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

describe('OfferCard', () => {
  beforeEach(() => {
    mockAPI.reset();
  });

  it('should render offer title', () => {
    const offer = makeMockOffer();
    renderOfferCard(offer);
    expect(screen.getAllByText(offer.title).length).toBeGreaterThan(0);
  });

  it('should render offer price', () => {
    const offer = { ...makeMockOffer(), price: 250 };
    const { container } = renderOfferCard(offer);
    expect(
      container.querySelector('.place-card__price-value'),
    ).toHaveTextContent('250');
  });

  it('should render offer type', () => {
    const offer = { ...makeMockOffer(), type: 'apartment' };
    renderOfferCard(offer as Offer);
    expect(screen.getByText('apartment')).toBeInTheDocument();
  });

  it('should render Premium badge when isPremium is true', () => {
    const offer = { ...makeMockOffer(), isPremium: true };
    renderOfferCard(offer);
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should not render Premium badge when isPremium is false', () => {
    const offer = { ...makeMockOffer(), isPremium: false };
    renderOfferCard(offer);
    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should render bookmark button as active when isFavorite is true', () => {
    const offer = { ...makeMockOffer(), isFavorite: true };
    const { container } = renderOfferCard(offer);
    expect(container.querySelector('.place-card__bookmark-button')).toHaveClass(
      'place-card__bookmark-button--active',
    );
  });

  it('should not render bookmark button as active when isFavorite is false', () => {
    const offer = { ...makeMockOffer(), isFavorite: false };
    const { container } = renderOfferCard(offer);
    expect(
      container.querySelector('.place-card__bookmark-button'),
    ).not.toHaveClass('place-card__bookmark-button--active');
  });

  it('should navigate to /login when bookmark is clicked by unauthorized user', () => {
    const offer = { ...makeMockOffer(), isFavorite: false };
    renderOfferCard(offer, AuthorizationStatus.NoAuth);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should dispatch toggleFavorite when bookmark is clicked by authorized user', async () => {
    const offer = { ...makeMockOffer(), isFavorite: false };
    const updated = { ...offer, isFavorite: true };
    mockAPI.onPost(`/favorite/${offer.id}/1`).reply(200, updated);

    const store = makeStore(AuthorizationStatus.Auth, [offer]);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferCard offer={offer} classNamePrefix="cities" />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button'));
    await vi.waitFor(() => {
      expect(store.getState()[NameSpace.Data].favoriteOffers).toContainEqual(
        updated,
      );
    });
  });
});
