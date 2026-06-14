import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import Header from './Header';
import { rootReducer } from './store/rootReducer';
import { AuthorizationStatus, AuthInfo } from './types/auth';
import { NameSpace } from './types/namespace';
import { createAPI } from './utils/api';
import { makeMockAuthInfo, makeMockOffer } from './utils/mock';

const api = createAPI();
const mockAPI = new MockAdapter(api);

const makeStore = (
  authorizationStatus = AuthorizationStatus.NoAuth,
  userData: AuthInfo | null = null,
  favoriteOffers: ReturnType<typeof makeMockOffer>[] = [],
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
        favoriteOffers,
        currentOffer: null,
        nearbyOffers: [],
        reviews: [],
      },
      [NameSpace.User]: { authorizationStatus, userData },
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: api } }),
  });

const renderHeader = (
  status = AuthorizationStatus.NoAuth,
  userData: AuthInfo | null = null,
  isActiveMain = false,
) =>
  render(
    <Provider store={makeStore(status, userData, [])}>
      <MemoryRouter>
        <Header isActiveMain={isActiveMain} />
      </MemoryRouter>
    </Provider>,
  );

describe('Header', () => {
  beforeEach(() => {
    mockAPI.reset();
  });

  it('should render Sign in link when not authorized', () => {
    renderHeader();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should render user email when authorized', () => {
    const userData = makeMockAuthInfo();
    renderHeader(AuthorizationStatus.Auth, userData);
    expect(screen.getByText(userData.email)).toBeInTheDocument();
  });

  it('should render favorites count when authorized', () => {
    const userData = makeMockAuthInfo();
    const favoriteOffer = makeMockOffer();
    render(
      <Provider
        store={makeStore(AuthorizationStatus.Auth, userData, [favoriteOffer])}
      >
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should render Sign out button when authorized', () => {
    const userData = makeMockAuthInfo();
    renderHeader(AuthorizationStatus.Auth, userData);
    expect(
      screen.getByRole('button', { name: /sign out/i }),
    ).toBeInTheDocument();
  });

  it('should dispatch logout and set NoAuth on Sign out click', async () => {
    mockAPI.onDelete('/login').reply(204);
    const userData = makeMockAuthInfo();
    const store = makeStore(AuthorizationStatus.Auth, userData);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));
    await vi.waitFor(() => {
      expect(store.getState()[NameSpace.User].authorizationStatus).toBe(
        AuthorizationStatus.NoAuth,
      );
    });
  });

  it('should add active class to logo link when isActiveMain is true', () => {
    const { container } = renderHeader(AuthorizationStatus.NoAuth, null, true);
    expect(container.querySelector('.header__logo-link')).toHaveClass(
      'header__logo-link--active',
    );
  });

  it('should not add active class to logo link when isActiveMain is false', () => {
    const { container } = renderHeader(AuthorizationStatus.NoAuth, null, false);
    expect(container.querySelector('.header__logo-link')).not.toHaveClass(
      'header__logo-link--active',
    );
  });
});
