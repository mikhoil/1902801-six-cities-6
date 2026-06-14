import { describe, it, expect } from 'vitest';
import { dataReducer } from './dataReducer';
import {
  fetchOffers,
  fetchOffer,
  fetchNearbyOffers,
  fetchReviews,
  submitReview,
  fetchFavorites,
  toggleFavorite,
} from '../apiActions';
import { makeMockOffer, makeMockReview } from '../../utils/mock';

describe('dataReducer', () => {
  const initialState = {
    offers: [],
    favoriteOffers: [],
    currentOffer: null,
    nearbyOffers: [],
    reviews: [],
  };

  it('should return initial state with unknown action', () => {
    expect(dataReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('should set offers on fetchOffers.fulfilled', () => {
    const offers = [makeMockOffer(), makeMockOffer()];
    const result = dataReducer(
      initialState,
      fetchOffers.fulfilled(offers, '', undefined),
    );
    expect(result.offers).toEqual(offers);
  });

  it('should clear currentOffer on fetchOffer.pending', () => {
    const state = { ...initialState, currentOffer: makeMockOffer() };
    const result = dataReducer(state, fetchOffer.pending('', ''));
    expect(result.currentOffer).toBeNull();
  });

  it('should set currentOffer on fetchOffer.fulfilled', () => {
    const offer = makeMockOffer();
    const result = dataReducer(
      initialState,
      fetchOffer.fulfilled(offer, '', ''),
    );
    expect(result.currentOffer).toEqual(offer);
  });

  it('should set nearbyOffers on fetchNearbyOffers.fulfilled', () => {
    const nearby = [makeMockOffer()];
    const result = dataReducer(
      initialState,
      fetchNearbyOffers.fulfilled(nearby, '', ''),
    );
    expect(result.nearbyOffers).toEqual(nearby);
  });

  it('should set reviews on fetchReviews.fulfilled', () => {
    const reviews = [makeMockReview(), makeMockReview()];
    const result = dataReducer(
      initialState,
      fetchReviews.fulfilled(reviews, '', ''),
    );
    expect(result.reviews).toEqual(reviews);
  });

  it('should replace reviews on submitReview.fulfilled', () => {
    const reviews = [makeMockReview()];
    const result = dataReducer(
      initialState,
      submitReview.fulfilled(reviews, '', {
        offerId: '1',
        comment: '',
        rating: 4,
      }),
    );
    expect(result.reviews).toEqual(reviews);
  });

  it('should set favoriteOffers on fetchFavorites.fulfilled', () => {
    const favorites = [makeMockOffer()];
    const result = dataReducer(
      initialState,
      fetchFavorites.fulfilled(favorites, '', undefined),
    );
    expect(result.favoriteOffers).toEqual(favorites);
  });

  it('should update offer in offers array on toggleFavorite.fulfilled', () => {
    const offer = { ...makeMockOffer(), isFavorite: false };
    const state = { ...initialState, offers: [offer] };
    const updated = { ...offer, isFavorite: true };
    const result = dataReducer(
      state,
      toggleFavorite.fulfilled(updated, '', { offerId: offer.id, status: 1 }),
    );
    expect(result.offers[0].isFavorite).toBe(true);
  });

  it('should add offer to favoriteOffers when isFavorite becomes true', () => {
    const offer = { ...makeMockOffer(), isFavorite: true };
    const state = { ...initialState, offers: [offer] };
    const result = dataReducer(
      state,
      toggleFavorite.fulfilled(offer, '', { offerId: offer.id, status: 1 }),
    );
    expect(result.favoriteOffers).toContainEqual(offer);
  });

  it('should remove offer from favoriteOffers when isFavorite becomes false', () => {
    const offer = { ...makeMockOffer(), isFavorite: false };
    const state = {
      ...initialState,
      offers: [offer],
      favoriteOffers: [{ ...offer, isFavorite: true }],
    };
    const result = dataReducer(
      state,
      toggleFavorite.fulfilled(offer, '', { offerId: offer.id, status: 0 }),
    );
    expect(result.favoriteOffers).toHaveLength(0);
  });

  it('should update currentOffer on toggleFavorite.fulfilled when ids match', () => {
    const offer = { ...makeMockOffer(), isFavorite: false };
    const state = { ...initialState, currentOffer: offer, offers: [offer] };
    const updated = { ...offer, isFavorite: true };
    const result = dataReducer(
      state,
      toggleFavorite.fulfilled(updated, '', { offerId: offer.id, status: 1 }),
    );
    expect(result.currentOffer?.isFavorite).toBe(true);
  });

  it('should not change currentOffer on toggleFavorite.fulfilled when ids differ', () => {
    const offer = { ...makeMockOffer(), id: 'offer-1', isFavorite: false };
    const current = { ...makeMockOffer(), id: 'other', isFavorite: false };
    const state = { ...initialState, currentOffer: current, offers: [offer] };
    const updated = { ...offer, isFavorite: true };
    const result = dataReducer(
      state,
      toggleFavorite.fulfilled(updated, '', { offerId: offer.id, status: 1 }),
    );
    expect(result.currentOffer?.isFavorite).toBe(false);
  });
});
