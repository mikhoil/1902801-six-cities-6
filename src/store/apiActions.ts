import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Offer } from '../types/offer';
import { AuthInfo } from '../types/auth';
import { saveToken } from '../utils/auth';

type LoginCredentials = {
  email: string;
  password: string;
};

export const fetchOffers = createAsyncThunk<
  Offer[],
  undefined,
  { extra: AxiosInstance }
>('data/fetchOffers', async (_arg, { extra: api }) => {
  const { data } = await api.get<Offer[]>('/offers');
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
