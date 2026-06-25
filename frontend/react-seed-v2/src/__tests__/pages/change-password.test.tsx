import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import { userEvent } from '@testing-library/user-event';
import ChangePassword from '@/pages/change-password';
import api from '@/utils/api';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (k: string) => k }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

describe('ChangePassword page', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders all three password fields', () => {
        render(<ChangePassword />);
        expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
        expect(screen.getByLabelText('New Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
    });

    it('shows validation error when passwords do not match', async () => {
        const user = userEvent.setup();
        render(<ChangePassword />);

        await user.type(screen.getByLabelText('Current Password'), 'OldPass1!');
        await user.type(screen.getByLabelText('New Password'), 'NewPass1!');
        await user.type(screen.getByLabelText('Confirm New Password'), 'DifferentPass1!');
        await user.click(screen.getByRole('button', { name: /change password/i }));

        await waitFor(() => {
            expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
        });
    });

    it('calls api.post and navigates on success', async () => {
        const user = userEvent.setup();
        vi.spyOn(api, 'post').mockResolvedValue({ data: {} });

        render(<ChangePassword />);

        await user.type(screen.getByLabelText('Current Password'), 'OldPass1!');
        await user.type(screen.getByLabelText('New Password'), 'NewPass1!');
        await user.type(screen.getByLabelText('Confirm New Password'), 'NewPass1!');
        await user.click(screen.getByRole('button', { name: /change password/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/change-password', {
                currentPassword: 'OldPass1!',
                newPassword: 'NewPass1!',
            });
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('does not navigate on API failure', async () => {
        const user = userEvent.setup();
        vi.spyOn(api, 'post').mockRejectedValue(new Error('Wrong password'));

        render(<ChangePassword />);

        await user.type(screen.getByLabelText('Current Password'), 'WrongPass!');
        await user.type(screen.getByLabelText('New Password'), 'NewPass1!');
        await user.type(screen.getByLabelText('Confirm New Password'), 'NewPass1!');
        await user.click(screen.getByRole('button', { name: /change password/i }));

        await waitFor(() => {
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});
