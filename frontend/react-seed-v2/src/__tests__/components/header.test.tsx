import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '@/components/header';
import { useAuthStore } from '@/utils/store';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) =>
    ({
      'header.home': 'Home',
      'header.tasks': 'Tasks',
      'header.dashboard': 'Dashboard',
      'header.changePassword': 'Change Password',
      'header.signOut': 'Sign Out',
      'header.adminDashboard': 'GO TO ADMIN DASHBOARD',
      'header.admin': 'Admin',
    }[key] ?? key),
  }),
}));

// Mock language switcher
vi.mock('@/components/language-switcher', () => ({
  LanguageSwitcher: () => <div>Language Switcher</div>,
}));

// Mock auth store
vi.mock('@/utils/store', () => ({
  useAuthStore: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Header', () => {
  const renderHeader = () =>
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders base nav links for MEMBER user', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', email: 'user@test.com', name: 'Test User', role: 'MEMBER' },
      logout: vi.fn(),
    });

    renderHeader();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Language Switcher')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
    expect(screen.getByText('Change Password')).toBeInTheDocument();

    // Admin-only links must NOT be visible for MEMBER
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('renders Dashboard and Admin links for ADMIN user', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', email: 'admin@test.com', name: 'Admin User', role: 'ADMIN' },
      logout: vi.fn(),
    });

    renderHeader();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('Admin link points to /admin', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', email: 'admin@test.com', name: 'Admin User', role: 'ADMIN' },
      logout: vi.fn(),
    });

    renderHeader();

    expect(screen.getByRole('link', { name: /admin/i })).toHaveAttribute('href', '/admin');
  });

  it('handles sign out correctly', () => {
    const mockLogout = vi.fn();
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', email: 'user@test.com', name: 'Test User', role: 'MEMBER' },
      logout: mockLogout,
    });

    renderHeader();

    fireEvent.click(screen.getByText('Sign Out'));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/auth/sign-in');
  });

  it('Dashboard link points to /dashboard', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', email: 'user@test.com', name: 'Test User', role: 'MEMBER' },
      logout: vi.fn(),
    });

    renderHeader();

    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/dashboard');
  });

  it('Tasks link points to /tasks', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', email: 'user@test.com', name: 'Test User', role: 'MEMBER' },
      logout: vi.fn(),
    });

    renderHeader();

    expect(screen.getByText('Tasks').closest('a')).toHaveAttribute('href', '/tasks');
  });

  it('Dashboard link points to /dashboard for admin', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', email: 'admin@test.com', name: 'Admin User', role: 'ADMIN' },
      logout: vi.fn(),
    });

    renderHeader();

    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/dashboard');
  });
});