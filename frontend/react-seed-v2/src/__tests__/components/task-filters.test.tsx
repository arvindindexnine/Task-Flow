import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { userEvent } from '@testing-library/user-event';
import { TaskFiltersBar } from '@/pages/tasks/task-filters';
import type { TaskFilters } from '@/utils/types';

const defaultFilters: TaskFilters = {
    status: '',
    priority: '',
    page: 1,
    limit: 10,
    sortOrder: 'ASC',
};

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('TaskFiltersBar', () => {
    it('renders all filter controls', () => {
        const onChange = vi.fn();
        const onReset = vi.fn();
        render(
            <TaskFiltersBar filters={defaultFilters} onChange={onChange} onReset={onReset} />
        );
        expect(screen.getByLabelText(/filters.status/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/filters.priority/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/table.dueDate/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filters.reset/i })).toBeInTheDocument();
    });

    it('calls onReset when Reset button is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onReset = vi.fn();
        render(
            <TaskFiltersBar filters={defaultFilters} onChange={onChange} onReset={onReset} />
        );
        await user.click(screen.getByRole('button', { name: /filters.reset/i }));
        expect(onReset).toHaveBeenCalled();
    });
});
