import { render, screen } from '@/test/test-utils';
import Home from '@/pages/home';
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/utils/store';

describe('Home', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('renders welcome message with "there" when no user is logged in', () => {
    render(<Home />);
    expect(screen.getByText(/hello there/i)).toBeInTheDocument();
  });

  it('renders welcome message with the user name when logged in', () => {
    useAuthStore.getState().setAuth('token', {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      role: 'MEMBER',
    });

    render(<Home />);
    expect(screen.getByText(/hello alice/i)).toBeInTheDocument();
  });

  it('renders app name in the subtitle', () => {
    render(<Home />);
    expect(screen.getByText(/indexnine task flow/i)).toBeInTheDocument();
  });
});