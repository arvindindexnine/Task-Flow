import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { AdminRoute } from '@/components/admin-route';
import { useAuthStore } from '@/utils/store';

// Mock the Outlet component from react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Admin Content</div>,
  };
});

describe('AdminRoute', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('redirects to /unauthorized when user is not logged in', () => {
    render(<AdminRoute />);
    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
    expect(window.location.pathname).toBe('/unauthorized');
  });

  it('redirects to /unauthorized when user is a MEMBER', () => {
    useAuthStore.getState().setAuth('member-token', {
      id: '2',
      name: 'Bob Member',
      email: 'bob@example.com',
      role: 'MEMBER',
    });
    render(<AdminRoute />);
    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
    expect(window.location.pathname).toBe('/unauthorized');
  });

  it('renders outlet when user is ADMIN', () => {
    useAuthStore.getState().setAuth('admin-token', {
      id: '1',
      name: 'Alice Admin',
      email: 'alice@example.com',
      role: 'ADMIN',
    });
    render(<AdminRoute />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});