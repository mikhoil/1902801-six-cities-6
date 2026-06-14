import { createAction } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../types/auth';

export const setActiveCity = createAction<string>('city/change');
export const requireAuthorization = createAction<AuthorizationStatus>(
  'user/requireAuthorization',
);
