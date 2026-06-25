import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { TaskItem } from '@/pages/tasks/task-item';
import { useAuthStore } from '@/utils/store';
import type { Task } from '@/utils/types';

const mockTask: Task = {
    id: 42,
    title: 'Deploy to production',
    description: 'Final deployment step',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: '2026-03-10T00:00:00.000Z',
    userId: 10,
};

describe('TaskItem — RBAC UI enforcement', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useAuthStore.getState().logout();
    });

    it('shows edit and delete buttons for the task owner (MEMBER)', () => {
        // User is the owner of this task (userId: 10)
        useAuthStore.getState().setAuth('token', {
            id: '10',
            name: 'Owner',
            email: 'owner@example.com',
            role: 'MEMBER',
        });

        render(
            <table><tbody>
                <TaskItem task={mockTask} onEdit={onEdit} onDelete={onDelete} />
            </tbody></table>
        );

        expect(screen.getByRole('button', { name: /edit task/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /delete task/i })).toBeInTheDocument();
    });

    it('hides action buttons for a MEMBER who does not own the task', () => {
        // Different user — not the owner
        useAuthStore.getState().setAuth('token', {
            id: '99',
            name: 'Other User',
            email: 'other@example.com',
            role: 'MEMBER',
        });

        render(
            <table><tbody>
                <TaskItem task={mockTask} onEdit={onEdit} onDelete={onDelete} />
            </tbody></table>
        );

        expect(screen.queryByRole('button', { name: /edit task/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /delete task/i })).not.toBeInTheDocument();
    });

    it('shows edit and delete buttons for ADMIN on any task', () => {
        // Admin — does not own the task but should still see all actions
        useAuthStore.getState().setAuth('admin-token', {
            id: '1',
            name: 'Alice Admin',
            email: 'alice@example.com',
            role: 'ADMIN',
        });

        render(
            <table><tbody>
                <TaskItem task={mockTask} onEdit={onEdit} onDelete={onDelete} />
            </tbody></table>
        );

        expect(screen.getByRole('button', { name: /edit task/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /delete task/i })).toBeInTheDocument();
    });

    it('calls onEdit only when edit button is visible and clicked', async () => {
        const { userEvent } = await import('@testing-library/user-event');
        const user = userEvent.setup();

        useAuthStore.getState().setAuth('token', {
            id: '10',
            name: 'Owner',
            email: 'owner@example.com',
            role: 'MEMBER',
        });

        render(
            <table><tbody>
                <TaskItem task={mockTask} onEdit={onEdit} onDelete={onDelete} />
            </tbody></table>
        );

        await user.click(screen.getByRole('button', { name: /edit task/i }));
        expect(onEdit).toHaveBeenCalledWith(mockTask);
    });

    it('calls onDelete only when delete button is visible and clicked', async () => {
        const { userEvent } = await import('@testing-library/user-event');
        const user = userEvent.setup();

        useAuthStore.getState().setAuth('admin-token', {
            id: '1',
            name: 'Alice Admin',
            email: 'alice@example.com',
            role: 'ADMIN',
        });

        render(
            <table><tbody>
                <TaskItem task={mockTask} onEdit={onEdit} onDelete={onDelete} />
            </tbody></table>
        );

        await user.click(screen.getByRole('button', { name: /delete task/i }));
        expect(onDelete).toHaveBeenCalledWith(42);
    });
});
