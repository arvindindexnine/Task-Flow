import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/routes/constants';
import { useAuthStore } from '@/utils/store';

export const ProtectedRoute: React.FC = () => {
  const { isLoggedIn, expiresAt, logout } = useAuthStore();

  // Treat expired token as logged out
  const isExpired = expiresAt !== null && Date.now() > expiresAt;

  React.useEffect(() => {
    if (isExpired) logout();
  }, [isExpired, logout]);

  if (!isLoggedIn || isExpired) {
    return <Navigate to={ROUTES.AUTH.SIGN_IN} replace />;
  }

  return <Outlet />;
};
