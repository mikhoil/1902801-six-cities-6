import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { NameSpace } from '../types/namespace';

export const selectCity = (state: RootState) => state[NameSpace.App].city;
export const selectIsOffersLoading = (state: RootState) =>
  state[NameSpace.App].isOffersLoading;
export const selectIsOfferLoading = (state: RootState) =>
  state[NameSpace.App].isOfferLoading;

export const selectOffers = (state: RootState) => state[NameSpace.Data].offers;
export const selectCurrentOffer = (state: RootState) =>
  state[NameSpace.Data].currentOffer;
export const selectNearbyOffers = (state: RootState) =>
  state[NameSpace.Data].nearbyOffers;
export const selectReviews = (state: RootState) =>
  state[NameSpace.Data].reviews;

export const selectAuthorizationStatus = (state: RootState) =>
  state[NameSpace.User].authorizationStatus;
export const selectUserData = (state: RootState) =>
  state[NameSpace.User].userData;

export const selectCityOffers = createSelector(
  [selectOffers, selectCity],
  (offers, city) => offers.filter((offer) => offer.city.name === city),
);

export const selectFavoriteOffers = createSelector([selectOffers], (offers) =>
  offers.filter((offer) => offer.isFavorite),
);
