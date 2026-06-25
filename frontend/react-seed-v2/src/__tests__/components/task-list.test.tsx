import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { TaskList } from '@/pages/tasks/task-list';
import { useAuthStore } from '@/utils/store';
import type { Task } from '@/utils/types';

// Tasks owned by userId: 1
const mockTasks: Task[] = [
    {
        id: 1,
        title: 'Fix the bug',
        description: 'Urgent fix needed',
        status: 'TODO',
        priority: 'HIGH',
        dueDate: '2026-03-01T00:00:00.000Z',
        userId: 1,
    },
    {
        id: 2,
        title: 'Write tests',
        description: undefined,
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        dueDate: undefined,
        userId: 1,
    },
];

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('TaskList', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Set up a logged-in user who owns userId: 1 tasks
        useAuthStore.getState().setAuth('token', {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            role: 'MEMBER',
        });
    });

    it('renders a loading spinner when loading', () => {
        render(
            <TaskList tasks={[]} loading={true} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        );
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders empty state when no tasks', () => {
        render(
            <TaskList tasks={[]} loading={false} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        );
        // Using exact match to avoid matching 'noTasksDescription'
        expect(screen.getByText('noTasks')).toBeInTheDocument();
    });

    it('renders table headers', () => {
        render(
            <TaskList tasks={mockTasks} loading={false} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        );
        expect(screen.getByText('table.title')).toBeInTheDocument();
        expect(screen.getByText('table.status')).toBeInTheDocument();
        expect(screen.getByText('table.priority')).toBeInTheDocument();
        expect(screen.getByText('table.dueDate')).toBeInTheDocument();
    });

    it('renders task rows with correct data', () => {
        render(
            <TaskList tasks={mockTasks} loading={false} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        );
        expect(screen.getAllByText('Fix the bug')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Write tests')[0]).toBeInTheDocument();
        expect(screen.getAllByText(/status\.todo/i)[0]).toBeInTheDocument();
        // Use a more flexible check for the in-progress status
        expect(screen.getAllByText(/inProgress/i).length).toBeGreaterThan(0);
    });

    it('calls onEdit when edit button is clicked', async () => {
        const { userEvent } = await import('@testing-library/user-event');
        const user = userEvent.setup();
        render(
            <TaskList tasks={mockTasks} loading={false} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        );
        const editButtons = screen.getAllByRole('button', { name: /edit task/i });
        await user.click(editButtons[0]);
        expect(mockOnEdit).toHaveBeenCalledWith(mockTasks[0]);
    });

    it('calls onDelete when delete button is clicked', async () => {
        const { userEvent } = await import('@testing-library/user-event');
        const user = userEvent.setup();
        render(
            <TaskList tasks={mockTasks} loading={false} onEdit={mockOnEdit} onDelete={mockOnDelete} />
        );
        const deleteButtons = screen.getAllByRole('button', { name: /delete task/i });
        await user.click(deleteButtons[0]);
        expect(mockOnDelete).toHaveBeenCalledWith(1);
    });
});
