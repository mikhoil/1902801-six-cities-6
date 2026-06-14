import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import LoginPage from './LoginPage';
import { rootReducer } from '../store/rootReducer';
import { AuthorizationStatus } from '../types/auth';
import { NameSpace } from '../types/namespace';
import { createAPI } from '../utils/api';
import { mockCityNames } from '../mocks/cities';

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
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<div>Main Page</div>} />
        </Routes>
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

  it('should dispatch login when form is submitted with valid password', async () => {
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
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<div>Main Page</div>} />
          </Routes>
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

  it('should not dispatch login when password has no digits', () => {
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
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'onlyletters' },
    });
    fireEvent.submit(
      screen
        .getByRole('button', { name: /sign in/i })
        .closest('form') as HTMLFormElement,
    );

    expect(store.getState()[NameSpace.User].authorizationStatus).toBe(
      AuthorizationStatus.NoAuth,
    );
  });

  it('should display a random city from the city list', () => {
    renderLoginPage();
    const cityLinks = mockCityNames
      .map((name) => screen.queryByText(name))
      .filter(Boolean);
    expect(cityLinks.length).toBe(1);
  });

  it('should dispatch changeCity and navigate to "/" when city link is clicked', () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<div>Main Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    const cityLink = mockCityNames
      .map((name) => screen.queryByText(name))
      .find(Boolean) as HTMLElement;
    const cityName = cityLink.textContent as string;
    fireEvent.click(cityLink);

    expect(store.getState()[NameSpace.App].city).toBe(cityName);
    expect(screen.getByText('Main Page')).toBeInTheDocument();
  });
});
