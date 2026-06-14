import { createAction } from '@reduxjs/toolkit';

export const setActiveCity = createAction<string>('city/change');
