import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { RoleGuard } from '@/components/role-guard';
import { useAuthStore } from '@/utils/store';

describe('RoleGuard', () => {
    beforeEach(() => {
        useAuthStore.getState().logout();
    });

    it('redirects to /unauthorized when user has no role (unauthenticated)', () => {
        render(
            <RoleGuard roles={['ADMIN']}>
                <div data-testid="protected-content">Admin Only</div>
            </RoleGuard>
        );
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
        expect(window.location.pathname).toBe('/unauthorized');
    });

    it('blocks a MEMBER from accessing an ADMIN-only area', () => {
        useAuthStore.getState().setAuth('member-token', {
            id: '2',
            name: 'Bob Member',
            email: 'bob@example.com',
            role: 'MEMBER',
        });

        render(
            <RoleGuard roles={['ADMIN']}>
                <div data-testid="admin-content">Admin Panel</div>
            </RoleGuard>
        );

        expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
        expect(window.location.pathname).toBe('/unauthorized');
    });

    it('allows an ADMIN to access an ADMIN-only area', () => {
        useAuthStore.getState().setAuth('admin-token', {
            id: '1',
            name: 'Alice Admin',
            email: 'alice@example.com',
            role: 'ADMIN',
        });

        render(
            <RoleGuard roles={['ADMIN']}>
                <div data-testid="admin-content">Admin Panel</div>
            </RoleGuard>
        );

        expect(screen.getByTestId('admin-content')).toBeInTheDocument();
    });

    it('allows a MEMBER to access a MEMBER-allowed area', () => {
        useAuthStore.getState().setAuth('member-token', {
            id: '2',
            name: 'Bob Member',
            email: 'bob@example.com',
            role: 'MEMBER',
        });

        render(
            <RoleGuard roles={['MEMBER']}>
                <div data-testid="member-content">Member Area</div>
            </RoleGuard>
        );

        expect(screen.getByTestId('member-content')).toBeInTheDocument();
    });

    it('allows access when multiple roles are specified and user matches one', () => {
        useAuthStore.getState().setAuth('admin-token', {
            id: '1',
            name: 'Alice Admin',
            email: 'alice@example.com',
            role: 'ADMIN',
        });

        render(
            <RoleGuard roles={['ADMIN', 'MEMBER']}>
                <div data-testid="shared-content">Shared Area</div>
            </RoleGuard>
        );

        expect(screen.getByTestId('shared-content')).toBeInTheDocument();
    });
});
