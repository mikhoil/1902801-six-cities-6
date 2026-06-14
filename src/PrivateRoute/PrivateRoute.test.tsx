import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PrivateRoute from './PrivateRoute';
import { rootReducer } from '../store/rootReducer';
import { AuthorizationStatus } from '../types/auth';
import { NameSpace } from '../types/namespace';

const makeStore = (authorizationStatus: AuthorizationStatus) =>
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

const renderPrivateRoute = (status: AuthorizationStatus) =>
  render(
    <Provider store={makeStore(status)}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <div>Protected</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

describe('PrivateRoute', () => {
  it('should render children when user is authorized', () => {
    renderPrivateRoute(AuthorizationStatus.Auth);
    expect(screen.getByText('Protected')).toBeInTheDocument();
  });

  it('should render Spinner when auth status is Unknown', () => {
    const { container } = renderPrivateRoute(AuthorizationStatus.Unknown);
    expect(container.querySelector('.spinner')).toBeInTheDocument();
    expect(screen.queryByText('Protected')).not.toBeInTheDocument();
  });

  it('should redirect to /login when user is not authorized', () => {
    renderPrivateRoute(AuthorizationStatus.NoAuth);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected')).not.toBeInTheDocument();
  });
});
