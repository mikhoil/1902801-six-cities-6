import { Navigate } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { PropsWithChildren } from 'react';
import { AuthorizationStatus } from '../types/auth';

export default function PrivateRoute({ children }: PropsWithChildren) {
  const authorizationStatus = useSelector(
    (state: RootState) => state.authorizationStatus,
  );

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    return <Spinner />;
  }

  return authorizationStatus === AuthorizationStatus.Auth ? (
    children
  ) : (
    <Navigate to="/login" />
  );
}
