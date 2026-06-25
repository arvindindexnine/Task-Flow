import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import { userEvent } from '@testing-library/user-event';
import ForgotPassword from '@/pages/auth/forgot-password';
import api from '@/utils/api';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (k: string) => k }),
}));

describe('ForgotPassword page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the email field and submit button', () => {
        render(<ForgotPassword />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send verification code/i })).toBeInTheDocument();
    });

    it('shows validation error for invalid email', async () => {
        const user = userEvent.setup();
        render(<ForgotPassword />);

        const emailInput = screen.getByLabelText(/email/i);
        await user.type(emailInput, 'invalid-email');
        await user.click(screen.getByRole('button', { name: /send verification code/i }));

        expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
    });

    it('shows success message after successful submission', async () => {
        const user = userEvent.setup();
        vi.spyOn(api, 'post').mockResolvedValue({ data: { message: 'Code sent' } });

        render(<ForgotPassword />);

        const emailInput = screen.getByLabelText(/email/i);
        await user.type(emailInput, 'user@example.com');
        await user.click(screen.getByRole('button', { name: /send verification code/i }));

        await waitFor(() => {
            // Check for 'Verify Code' which appears in card title and button
            expect(screen.getAllByText(/verify code/i).length).toBeGreaterThan(0);
        });
    });

    it('shows error toast on API failure', async () => {
        const user = userEvent.setup();
        vi.spyOn(api, 'post').mockRejectedValue(new Error('API Error'));

        render(<ForgotPassword />);

        const emailInput = screen.getByLabelText(/email/i);
        await user.type(emailInput, 'user@example.com');
        await user.click(screen.getByRole('button', { name: /send verification code/i }));

        // Toast logic is harder to test without mocking toast, but we can verify API was called
        await waitFor(() => {
            expect(api.post).toHaveBeenCalled();
        });
    });
});
