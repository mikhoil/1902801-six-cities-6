import { createReducer } from '@reduxjs/toolkit';
import { Offer } from '../types/offer';
import {
  checkAuth,
  fetchNearbyOffers,
  fetchOffer,
  fetchOffers,
  fetchReviews,
  login,
  submitReview,
} from './apiActions';
import { requireAuthorization, setActiveCity } from './action';
import { AuthInfo, AuthorizationStatus } from '../types/auth';
import { Review } from '../types/review';

type State = {
  activeCity: string;
  offers: Offer[];
  isOffersLoading: boolean;
  authorizationStatus: AuthorizationStatus;
  userData: AuthInfo | null;
  currentOffer: Offer | null;
  nearbyOffers: Offer[];
  reviews: Review[];
  isOfferLoading: boolean;
};

const initialState: State = {
  activeCity: 'Paris',
  offers: [],
  isOffersLoading: false,
  authorizationStatus: AuthorizationStatus.Unknown,
  userData: null,
  currentOffer: null,
  nearbyOffers: [],
  reviews: [],
  isOfferLoading: false,
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setActiveCity, (state, action) => {
      state.activeCity = action.payload;
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(fetchOffers.pending, (state) => {
      state.isOffersLoading = true;
    })
    .addCase(fetchOffers.fulfilled, (state, action) => {
      state.offers = action.payload;
      state.isOffersLoading = false;
    })
    .addCase(fetchOffers.rejected, (state) => {
      state.isOffersLoading = false;
    })
    .addCase(fetchOffer.pending, (state) => {
      state.isOfferLoading = true;
    })
    .addCase(fetchOffer.fulfilled, (state, action) => {
      state.currentOffer = action.payload;
      state.isOfferLoading = false;
    })
    .addCase(fetchOffer.rejected, (state) => {
      state.isOfferLoading = false;
    })
    .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
      state.nearbyOffers = action.payload;
    })
    .addCase(fetchReviews.fulfilled, (state, action) => {
      state.reviews = action.payload;
    })
    .addCase(submitReview.fulfilled, (state, action) => {
      state.reviews = action.payload;
    })
    .addCase(checkAuth.fulfilled, (state, action) => {
      state.authorizationStatus = AuthorizationStatus.Auth;
      state.userData = action.payload;
    })
    .addCase(checkAuth.rejected, (state) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.authorizationStatus = AuthorizationStatus.Auth;
      state.userData = action.payload;
    })
    .addCase(login.rejected, (state) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
    });
});
