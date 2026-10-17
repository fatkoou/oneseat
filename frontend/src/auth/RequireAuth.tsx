import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from './AuthContext';

export function RequireAuth() {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
