import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/routes/constants';
import { useAuthStore } from '@/utils/store';
import type { UserRole } from '@/types/role';

interface RoleGuardProps {
    /** Roles allowed to access the wrapped content */
    roles: UserRole[];
    children: React.ReactNode;
}

/**
 * RoleGuard — wraps any content and redirects to /unauthorized
 * if the authenticated user's role is not in the allowed list.
 *
 * Usage:
 *   <RoleGuard roles={['ADMIN']}>
 *     <AdminDashboard />
 *   </RoleGuard>
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ roles, children }) => {
    const user = useAuthStore((s) => s.user);

    if (!user || !roles.includes(user.role as UserRole)) {
        return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }

    return <>{children}</>;
};
