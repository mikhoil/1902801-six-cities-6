import { describe, it, expect } from 'vitest';
import { userReducer } from './userReducer';
import { requireAuthorization } from '../action';
import { checkAuth, login } from '../apiActions';
import { AuthorizationStatus } from '../../types/auth';
import { makeMockAuthInfo } from '../../utils/mock';

describe('userReducer', () => {
  const initialState = {
    authorizationStatus: AuthorizationStatus.Unknown,
    userData: null,
  };

  it('should return initial state with unknown action', () => {
    expect(userReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('should set authorizationStatus on requireAuthorization', () => {
    const result = userReducer(
      initialState,
      requireAuthorization(AuthorizationStatus.Auth),
    );
    expect(result.authorizationStatus).toBe(AuthorizationStatus.Auth);
  });

  it('should set authorizationStatus to NoAuth on requireAuthorization', () => {
    const result = userReducer(
      initialState,
      requireAuthorization(AuthorizationStatus.NoAuth),
    );
    expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
  });

  it('should set Auth and userData on checkAuth.fulfilled', () => {
    const authInfo = makeMockAuthInfo();
    const result = userReducer(
      initialState,
      checkAuth.fulfilled(authInfo, '', undefined),
    );
    expect(result.authorizationStatus).toBe(AuthorizationStatus.Auth);
    expect(result.userData).toEqual(authInfo);
  });

  it('should set NoAuth on checkAuth.rejected', () => {
    const result = userReducer(
      initialState,
      checkAuth.rejected(null, '', undefined),
    );
    expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    expect(result.userData).toBeNull();
  });

  it('should set Auth and userData on login.fulfilled', () => {
    const authInfo = makeMockAuthInfo();
    const result = userReducer(
      initialState,
      login.fulfilled(authInfo, '', { email: '', password: '' }),
    );
    expect(result.authorizationStatus).toBe(AuthorizationStatus.Auth);
    expect(result.userData).toEqual(authInfo);
  });

  it('should set NoAuth on login.rejected', () => {
    const result = userReducer(
      initialState,
      login.rejected(null, '', { email: '', password: '' }),
    );
    expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
  });
});
