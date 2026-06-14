import { combineReducers } from '@reduxjs/toolkit';
import { appReducer } from './app/appReducer';
import { dataReducer } from './data/dataReducer';
import { userReducer } from './user/userReducer';
import { NameSpace } from '../types/namespace';

export const rootReducer = combineReducers({
  [NameSpace.App]: appReducer,
  [NameSpace.Data]: dataReducer,
  [NameSpace.User]: userReducer,
});
