import { createReducer } from '@reduxjs/toolkit';
import { Offer } from '../types/offer';
import { fetchOffers } from './apiActions';
import { setActiveCity } from './action';

type State = {
  activeCity: string;
  offers: Offer[];
  isOffersLoading: boolean;
};

const initialState: State = {
  activeCity: 'Paris',
  offers: [],
  isOffersLoading: false,
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setActiveCity, (state, action) => {
      state.activeCity = action.payload;
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
    });
});
