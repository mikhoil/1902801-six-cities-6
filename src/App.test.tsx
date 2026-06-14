import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import { rootReducer } from './store/rootReducer';
import { AuthorizationStatus } from './types/auth';
import { NameSpace } from './types/namespace';

vi.mock('../main-page/main-page', () => ({
  default: () => <div>Main Page</div>,
}));
vi.mock('../login-page/login-page', () => ({
  default: () => <div>Login Page</div>,
}));
vi.mock('../favorites-page/favorites-page', () => ({
  default: () => <div>Favorites Page</div>,
}));
vi.mock('../offer-page/offer-page', () => ({
  default: () => <div>Offer Page</div>,
}));

const makeStore = (authorizationStatus = AuthorizationStatus.Auth) =>
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
      [NameSpace.User]: { authorizationStatus, userData: null },
    },
  });

describe('App routing', () => {
  it('should render MainPage at "/"', () => {
    window.history.pushState({}, '', '/');
    render(
      <Provider store={makeStore()}>
        <App />
      </Provider>,
    );
    expect(screen.getByText('Main Page')).toBeInTheDocument();
  });

  it('should render LoginPage at "/login"', () => {
    window.history.pushState({}, '', '/login');
    render(
      <Provider store={makeStore()}>
        <App />
      </Provider>,
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render FavoritesPage at "/favorites" when authorized', () => {
    window.history.pushState({}, '', '/favorites');
    render(
      <Provider store={makeStore(AuthorizationStatus.Auth)}>
        <App />
      </Provider>,
    );
    expect(screen.getByText('Favorites Page')).toBeInTheDocument();
  });

  it('should redirect to LoginPage at "/favorites" when not authorized', () => {
    window.history.pushState({}, '', '/favorites');
    render(
      <Provider store={makeStore(AuthorizationStatus.NoAuth)}>
        <App />
      </Provider>,
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render OfferPage at "/offer/:id"', () => {
    window.history.pushState({}, '', '/offer/abc123');
    render(
      <Provider store={makeStore()}>
        <App />
      </Provider>,
    );
    expect(screen.getByText('Offer Page')).toBeInTheDocument();
  });

  it('should render NotFoundPage at unknown route', () => {
    window.history.pushState({}, '', '/nonexistent-route');
    render(
      <Provider store={makeStore()}>
        <App />
      </Provider>,
    );
    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
  });
});
