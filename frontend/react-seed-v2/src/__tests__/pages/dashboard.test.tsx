import { render, screen } from '@/test/test-utils';
import Dashboard from '@/pages/dashboard';
import { useTaskStore, useAuthStore } from '@/utils/store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the stores
vi.mock('@/utils/store', () => ({
  useTaskStore: vi.fn(),
  useAuthStore: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Dashboard', () => {
  const mockFetchTasks = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock Auth Store implementation to handle selectors
    vi.mocked(useAuthStore).mockImplementation((selector: any) => selector({
      user: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'MEMBER' },
    }));

    // Mock Task Store implementation to handle selectors
    vi.mocked(useTaskStore).mockImplementation((selector: any) => selector({
      tasks: [],
      fetchTasks: mockFetchTasks,
    }));
  });

  it('renders user dashboard title and welcome message', () => {
    render(<Dashboard />);

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it('calls fetchTasks on mount', () => {
    render(<Dashboard />);
    expect(mockFetchTasks).toHaveBeenCalled();
  });

  it('renders summary cards', () => {
    render(<Dashboard />);

    expect(screen.getByText('stats.total')).toBeInTheDocument();
    expect(screen.getByText('stats.pending')).toBeInTheDocument();
    expect(screen.getByText('stats.completed')).toBeInTheDocument();
  });

  it('renders charts', () => {
    render(<Dashboard />);

    expect(screen.getByText('charts.frequency')).toBeInTheDocument();
    expect(screen.getByText('charts.status')).toBeInTheDocument();
  });
});