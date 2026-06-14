import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import OfferPage from './OfferPage';
import { rootReducer } from '../store/rootReducer';
import { AuthorizationStatus } from '../types/auth';
import { NameSpace } from '../types/namespace';
import { createAPI } from '../utils/api';
import { makeMockOffer } from '../utils/mock';

vi.mock('../map/map', () => ({ default: () => <div data-testid="map" /> }));

const api = createAPI();
const mockAPI = new MockAdapter(api);

const makeStore = (authorizationStatus = AuthorizationStatus.Auth) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      [NameSpace.App]: {
        city: 'Paris',
        isOffersLoading: false,
        isOfferLoading: true,
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

describe('OfferPage', () => {
  const mockOffer = makeMockOffer();

  const renderOfferPage = (authorizationStatus = AuthorizationStatus.Auth) => {
    mockAPI.onGet(`/offers/${mockOffer.id}`).reply(200, mockOffer);
    mockAPI.onGet(`/offers/${mockOffer.id}/nearby`).reply(200, []);
    mockAPI.onGet(`/comments/${mockOffer.id}`).reply(200, []);
    const store = makeStore(authorizationStatus);
    return {
      store,
      ...render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/offer/${mockOffer.id}`]}>
            <Routes>
              <Route path="/offer/:id" element={<OfferPage />} />
              <Route path="*" element={<div>Not Found</div>} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>,
      ),
    };
  };

  beforeEach(() => {
    mockAPI.reset();
  });

  it('should show spinner while offer is loading', () => {
    mockAPI.onGet(`/offers/${mockOffer.id}`).reply(200, mockOffer);
    mockAPI.onGet(`/offers/${mockOffer.id}/nearby`).reply(200, []);
    mockAPI.onGet(`/comments/${mockOffer.id}`).reply(200, []);
    const { container } = render(
      <Provider store={makeStore()}>
        <MemoryRouter initialEntries={[`/offer/${mockOffer.id}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('should redirect to not-found page when offer is not available', () => {
    mockAPI.onGet(`/offers/${mockOffer.id}`).reply(404);
    mockAPI.onGet(`/offers/${mockOffer.id}/nearby`).reply(200, []);
    mockAPI.onGet(`/comments/${mockOffer.id}`).reply(200, []);
    const store = configureStore({
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
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: { extraArgument: api } }),
    });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${mockOffer.id}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  it('should render offer title after loading', async () => {
    renderOfferPage();
    await vi.waitFor(() => {
      expect(screen.getByText(mockOffer.title)).toBeInTheDocument();
    });
  });

  it('should render map', async () => {
    renderOfferPage();
    await vi.waitFor(() => {
      expect(screen.getByTestId('map')).toBeInTheDocument();
    });
  });

  it('should render bedroom count with correct plural form', async () => {
    const offer = { ...makeMockOffer(), bedrooms: 1 };
    mockAPI.onGet(`/offers/${offer.id}`).reply(200, offer);
    mockAPI.onGet(`/offers/${offer.id}/nearby`).reply(200, []);
    mockAPI.onGet(`/comments/${offer.id}`).reply(200, []);
    const store = makeStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${offer.id}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
    await vi.waitFor(() => {
      expect(screen.getByText('1 Bedroom')).toBeInTheDocument();
    });
  });

  it('should render adults count with correct plural form', async () => {
    const offer = { ...makeMockOffer(), maxAdults: 1 };
    mockAPI.onGet(`/offers/${offer.id}`).reply(200, offer);
    mockAPI.onGet(`/offers/${offer.id}/nearby`).reply(200, []);
    mockAPI.onGet(`/comments/${offer.id}`).reply(200, []);
    const store = makeStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${offer.id}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
    await vi.waitFor(() => {
      expect(screen.getByText('Max 1 adult')).toBeInTheDocument();
    });
  });

  it('should navigate to /login when bookmark clicked by unauthorized user', async () => {
    renderOfferPage(AuthorizationStatus.NoAuth);
    await vi.waitFor(() => {
      expect(screen.getByText(mockOffer.title)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /bookmarks/i }));
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should dispatch toggleFavorite when bookmark clicked by authorized user', async () => {
    const updated = { ...mockOffer, isFavorite: true };
    mockAPI.onPost(`/favorite/${mockOffer.id}/1`).reply(200, updated);
    const { store } = renderOfferPage(AuthorizationStatus.Auth);
    await vi.waitFor(() => {
      expect(screen.getByText(mockOffer.title)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /bookmarks/i }));
    await vi.waitFor(() => {
      expect(store.getState()[NameSpace.Data].currentOffer?.isFavorite).toBe(
        true,
      );
    });
  });
});
