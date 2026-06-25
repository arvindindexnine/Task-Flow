import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/routes/constants';
import { useAuthStore } from '@/utils/store';
import type { User } from '@/utils/types';

/**
 * AdminRoute — Outlet-based guard for admin-only nested routes.
 * Redirects to /unauthorized (not HOME) to clearly signal insufficient permissions.
 */
export const AdminRoute: React.FC = () => {
  const user = useAuthStore((state: { user: User | null }) => state.user);

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
};