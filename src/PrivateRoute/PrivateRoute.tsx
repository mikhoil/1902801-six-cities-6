import { Navigate } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import { useSelector } from 'react-redux';
import { PropsWithChildren } from 'react';
import { AuthorizationStatus } from '../types/auth';
import { selectAuthorizationStatus } from '../store/selectors';

export default function PrivateRoute({ children }: PropsWithChildren) {
  const authorizationStatus = useSelector(selectAuthorizationStatus);

  if (authorizationStatus === AuthorizationStatus.Unknown) return <Spinner />;

  return authorizationStatus === AuthorizationStatus.Auth ? (
    children
  ) : (
    <Navigate to="/login" />
  );
}
