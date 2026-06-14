import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { configureStore } from '@reduxjs/toolkit';
import { createAPI } from '../utils/api';
import { rootReducer } from './rootReducer';
import { NameSpace } from '../types/namespace';
import {
  fetchOffers,
  fetchOffer,
  fetchNearbyOffers,
  fetchReviews,
  submitReview,
  checkAuth,
  fetchFavorites,
  toggleFavorite,
} from './apiActions';
import { makeMockOffer, makeMockReview, makeMockAuthInfo } from '../utils/mock';

const api = createAPI();
const mockAPI = new MockAdapter(api);

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: api } }),
  });

describe('api-actions', () => {
  beforeEach(() => {
    mockAPI.reset();
  });

  describe('fetchOffers', () => {
    it('should fill offers on success', async () => {
      const mockOffers = [makeMockOffer(), makeMockOffer()];
      mockAPI.onGet('/offers').reply(200, mockOffers);
      const store = makeStore();
      await store.dispatch(fetchOffers());
      expect(store.getState()[NameSpace.Data].offers).toEqual(mockOffers);
      expect(store.getState()[NameSpace.App].isOffersLoading).toBe(false);
    });

    it('should not fill offers on failure', async () => {
      mockAPI.onGet('/offers').reply(500);
      const store = makeStore();
      await store.dispatch(fetchOffers());
      expect(store.getState()[NameSpace.Data].offers).toEqual([]);
      expect(store.getState()[NameSpace.App].isOffersLoading).toBe(false);
    });
  });

  describe('fetchOffer', () => {
    it('should set currentOffer on success', async () => {
      const mockOffer = makeMockOffer();
      mockAPI.onGet(`/offers/${mockOffer.id}`).reply(200, mockOffer);
      const store = makeStore();
      await store.dispatch(fetchOffer(mockOffer.id));
      expect(store.getState()[NameSpace.Data].currentOffer).toEqual(mockOffer);
      expect(store.getState()[NameSpace.App].isOfferLoading).toBe(false);
    });

    it('should leave currentOffer null on failure', async () => {
      mockAPI.onGet('/offers/unknown').reply(404);
      const store = makeStore();
      await store.dispatch(fetchOffer('unknown'));
      expect(store.getState()[NameSpace.Data].currentOffer).toBeNull();
      expect(store.getState()[NameSpace.App].isOfferLoading).toBe(false);
    });
  });

  describe('fetchNearbyOffers', () => {
    it('should set nearbyOffers on success', async () => {
      const nearby = [makeMockOffer()];
      mockAPI.onGet('/offers/1/nearby').reply(200, nearby);
      const store = makeStore();
      await store.dispatch(fetchNearbyOffers('1'));
      expect(store.getState()[NameSpace.Data].nearbyOffers).toEqual(nearby);
    });
  });

  describe('fetchReviews', () => {
    it('should set reviews on success', async () => {
      const reviews = [makeMockReview()];
      mockAPI.onGet('/comments/1').reply(200, reviews);
      const store = makeStore();
      await store.dispatch(fetchReviews('1'));
      expect(store.getState()[NameSpace.Data].reviews).toEqual(reviews);
    });
  });

  describe('submitReview', () => {
    it('should replace reviews on success', async () => {
      const reviews = [makeMockReview()];
      mockAPI.onPost('/comments/1').reply(200, reviews);
      const store = makeStore();
      await store.dispatch(
        submitReview({ offerId: '1', comment: 'Great!', rating: 4 }),
      );
      expect(store.getState()[NameSpace.Data].reviews).toEqual(reviews);
    });
  });

  describe('checkAuth', () => {
    it('should set Auth and userData on success', async () => {
      const authInfo = makeMockAuthInfo();
      mockAPI.onGet('/login').reply(200, authInfo);
      const store = makeStore();
      await store.dispatch(checkAuth());
      expect(store.getState()[NameSpace.User].authorizationStatus).toBe('AUTH');
      expect(store.getState()[NameSpace.User].userData).toEqual(authInfo);
    });

    it('should set NoAuth on failure', async () => {
      mockAPI.onGet('/login').reply(401);
      const store = makeStore();
      await store.dispatch(checkAuth());
      expect(store.getState()[NameSpace.User].authorizationStatus).toBe(
        'NO_AUTH',
      );
    });
  });

  describe('fetchFavorites', () => {
    it('should set favoriteOffers on success', async () => {
      const favorites = [makeMockOffer()];
      mockAPI.onGet('/favorite').reply(200, favorites);
      const store = makeStore();
      await store.dispatch(fetchFavorites());
      expect(store.getState()[NameSpace.Data].favoriteOffers).toEqual(
        favorites,
      );
    });
  });

  describe('toggleFavorite', () => {
    it('should update favoriteOffers on success', async () => {
      const offer = { ...makeMockOffer(), isFavorite: false };
      const updated = { ...offer, isFavorite: true };
      mockAPI.onPost(`/favorite/${offer.id}/1`).reply(200, updated);
      const store = makeStore();
      await store.dispatch(toggleFavorite({ offerId: offer.id, status: 1 }));
      expect(store.getState()[NameSpace.Data].favoriteOffers).toContainEqual(
        updated,
      );
    });
  });
});
