import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthorized: boolean;
  children: JSX.Element;
}

export default function PrivateRoute({
  isAuthorized,
  children,
}: PrivateRouteProps): JSX.Element {
  return isAuthorized ? children : <Navigate to="/login" />;
}
