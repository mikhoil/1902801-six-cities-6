import { createReducer } from '@reduxjs/toolkit';
import { setActiveCity } from '../action';
import { fetchOffers, fetchOffer } from '../apiActions';

type AppState = {
  city: string;
  isOffersLoading: boolean;
  isOfferLoading: boolean;
};

const initialState: AppState = {
  city: 'Paris',
  isOffersLoading: false,
  isOfferLoading: false,
};

export const appReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setActiveCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(fetchOffers.pending, (state) => {
      state.isOffersLoading = true;
    })
    .addCase(fetchOffers.fulfilled, (state) => {
      state.isOffersLoading = false;
    })
    .addCase(fetchOffers.rejected, (state) => {
      state.isOffersLoading = false;
    })
    .addCase(fetchOffer.pending, (state) => {
      state.isOfferLoading = true;
    })
    .addCase(fetchOffer.fulfilled, (state) => {
      state.isOfferLoading = false;
    })
    .addCase(fetchOffer.rejected, (state) => {
      state.isOfferLoading = false;
    });
});
