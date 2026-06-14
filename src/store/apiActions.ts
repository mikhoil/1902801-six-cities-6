import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Offer } from '../types/offer';
import { Review } from '../types/review';
import { AuthInfo } from '../types/auth';
import { saveToken, dropToken } from '../utils/auth';

type LoginCredentials = {
  email: string;
  password: string;
};

type NewReview = {
  offerId: string;
  comment: string;
  rating: number;
};

type ToggleFavoriteParams = {
  offerId: string;
  status: 0 | 1;
};

export const fetchOffers = createAsyncThunk<
  Offer[],
  undefined,
  { extra: AxiosInstance }
>('data/fetchOffers', async (_arg, { extra: api }) => {
  const { data } = await api.get<Offer[]>('/offers');
  return data;
});

export const fetchOffer = createAsyncThunk<
  Offer,
  string,
  { extra: AxiosInstance }
>('data/fetchOffer', async (id, { extra: api }) => {
  const { data } = await api.get<Offer>(`/offers/${id}`);
  return data;
});

export const fetchNearbyOffers = createAsyncThunk<
  Offer[],
  string,
  { extra: AxiosInstance }
>('data/fetchNearbyOffers', async (id, { extra: api }) => {
  const { data } = await api.get<Offer[]>(`/offers/${id}/nearby`);
  return data;
});

export const fetchReviews = createAsyncThunk<
  Review[],
  string,
  { extra: AxiosInstance }
>('data/fetchReviews', async (id, { extra: api }) => {
  const { data } = await api.get<Review[]>(`/comments/${id}`);
  return data;
});

export const submitReview = createAsyncThunk<
  Review[],
  NewReview,
  { extra: AxiosInstance }
>('data/submitReview', async ({ offerId, comment, rating }, { extra: api }) => {
  const { data } = await api.post<Review[]>(`/comments/${offerId}`, {
    comment,
    rating,
  });
  return data;
});

export const checkAuth = createAsyncThunk<
  AuthInfo,
  undefined,
  { extra: AxiosInstance }
>('user/checkAuth', async (_arg, { extra: api }) => {
  const { data } = await api.get<AuthInfo>('/login');
  return data;
});

export const login = createAsyncThunk<
  AuthInfo,
  LoginCredentials,
  { extra: AxiosInstance }
>('user/login', async ({ email, password }, { extra: api }) => {
  const { data } = await api.post<AuthInfo>('/login', { email, password });
  saveToken(data.token);
  return data;
});

export const fetchFavorites = createAsyncThunk<
  Offer[],
  undefined,
  { extra: AxiosInstance }
>('data/fetchFavorites', async (_arg, { extra: api }) => {
  const { data } = await api.get<Offer[]>('/favorite');
  return data;
});

export const toggleFavorite = createAsyncThunk<
  Offer,
  ToggleFavoriteParams,
  { extra: AxiosInstance }
>('data/toggleFavorite', async ({ offerId, status }, { extra: api }) => {
  const { data } = await api.post<Offer>(`/favorite/${offerId}/${status}`);
  return data;
});

export const logout = createAsyncThunk<
  void,
  undefined,
  { extra: AxiosInstance }
>('user/logout', async (_arg, { extra: api }) => {
  await api.delete('/login');
  dropToken();
});
