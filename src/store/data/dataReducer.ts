import { createReducer } from '@reduxjs/toolkit';
import {
  fetchOffers,
  fetchOffer,
  fetchNearbyOffers,
  fetchReviews,
  submitReview,
} from '../apiActions';
import { Offer } from '../../types/offer';
import { Review } from '../../types/review';

type DataState = {
  offers: Offer[];
  currentOffer: Offer | null;
  nearbyOffers: Offer[];
  reviews: Review[];
};

const initialState: DataState = {
  offers: [],
  currentOffer: null,
  nearbyOffers: [],
  reviews: [],
};

export const dataReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchOffers.fulfilled, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(fetchOffer.pending, (state) => {
      state.currentOffer = null;
    })
    .addCase(fetchOffer.fulfilled, (state, action) => {
      state.currentOffer = action.payload;
    })
    .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
      state.nearbyOffers = action.payload;
    })
    .addCase(fetchReviews.fulfilled, (state, action) => {
      state.reviews = action.payload;
    })
    .addCase(submitReview.fulfilled, (state, action) => {
      state.reviews = action.payload;
    });
});
