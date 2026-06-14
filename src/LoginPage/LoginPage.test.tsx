import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import LoginPage from './LoginPage';
import { rootReducer } from '../store/rootReducer';
import { AuthorizationStatus } from '../types/auth';
import { NameSpace } from '../types/namespace';
import { createAPI } from '../utils/api';

const api = createAPI();
const mockAPI = new MockAdapter(api);

const makeStore = (authorizationStatus = AuthorizationStatus.NoAuth) =>
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
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: api } }),
  });

const renderLoginPage = (status = AuthorizationStatus.NoAuth) =>
  render(
    <Provider store={makeStore(status)}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>,
  );

describe('LoginPage', () => {
  beforeEach(() => {
    mockAPI.reset();
  });

  it('should render Sign in heading', () => {
    renderLoginPage();
    expect(
      screen.getByRole('heading', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('should render email and password inputs', () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    renderLoginPage();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('should dispatch login when form is submitted', async () => {
    mockAPI.onPost('/login').reply(200, {
      id: 1,
      email: 'test@test.com',
      name: 'Test',
      avatarUrl: 'http://avatar.com',
      isPro: false,
      token: 'token123',
    });
    const store = makeStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.submit(
      screen
        .getByRole('button', { name: /sign in/i })
        .closest('form') as HTMLFormElement,
    );

    await vi.waitFor(() => {
      expect(store.getState()[NameSpace.User].authorizationStatus).toBe(
        AuthorizationStatus.Auth,
      );
    });
  });
});
