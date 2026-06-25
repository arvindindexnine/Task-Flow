import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { userEvent } from '@testing-library/user-event';
import { Pagination } from '@/pages/tasks/pagination';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('Pagination', () => {
    it('renders nothing when totalPages <= 1', () => {
        const { container } = render(
            <Pagination page={1} totalPages={1} onPageChange={vi.fn()} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders page buttons for multiple pages', () => {
        render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />);
        expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
        expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
        expect(screen.getByLabelText('Page 3')).toBeInTheDocument();
    });

    it('disables Prev button on first page', () => {
        render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />);
        expect(screen.getByLabelText(/actions.prev/i)).toBeDisabled();
    });

    it('disables Next button on last page', () => {
        render(<Pagination page={3} totalPages={3} onPageChange={vi.fn()} />);
        expect(screen.getByLabelText(/actions.next/i)).toBeDisabled();
    });

    it('calls onPageChange with correct page when clicking a page button', async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();
        render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />);
        await user.click(screen.getByLabelText('Page 2'));
        expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageChange with page-1 when clicking Prev', async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();
        render(<Pagination page={2} totalPages={3} onPageChange={onPageChange} />);
        await user.click(screen.getByLabelText(/actions.prev/i));
        expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('calls onPageChange with page+1 when clicking Next', async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();
        render(<Pagination page={2} totalPages={3} onPageChange={onPageChange} />);
        await user.click(screen.getByLabelText(/actions.next/i));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });
});
