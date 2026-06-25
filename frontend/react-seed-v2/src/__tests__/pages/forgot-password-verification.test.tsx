import { render, screen, waitFor } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import ForgotPassword from '@/pages/auth/forgot-password';
import api from '@/utils/api';
import { ROUTES } from '@/routes/constants';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('ForgotPassword Verification Flow', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('successfully progresses from email to verification and verify code', async () => {
        const user = userEvent.setup();
        const apiPostSpy = vi.spyOn(api, 'post');

        // Mock successful email submission
        apiPostSpy.mockResolvedValueOnce({ data: {} });

        render(<ForgotPassword />);

        // Step 1: Email
        const emailInput = screen.getByLabelText(/email address/i);
        await user.type(emailInput, 'test@example.com');
        await user.click(screen.getByRole('button', { name: /send verification code/i }));

        await waitFor(() => {
            expect(apiPostSpy).toHaveBeenCalledWith('/auth/forgot-password', { email: 'test@example.com' });
            // Verify we are in Step 2 by checking for the verification code label
            expect(screen.getByText(/verification code/i)).toBeInTheDocument();
        });

        // Step 2: Verification Code
        const codeInput = screen.getByLabelText(/6-digit verification code/i);

        // Test typing numbers
        await user.type(codeInput, '123456');
        expect(codeInput).toHaveValue('123456');

        // Test non-numeric filtering
        await user.clear(codeInput);
        await user.type(codeInput, 'abc12def');
        expect(codeInput).toHaveValue('12');

        // Mock successful verification
        apiPostSpy.mockResolvedValueOnce({ data: { message: 'Code verified' } });

        await user.clear(codeInput);
        await user.type(codeInput, '937598');
        // Click the specific "Verify Code" button
        await user.click(screen.getByRole('button', { name: /^verify code$/i }));

        await waitFor(() => {
            expect(apiPostSpy).toHaveBeenCalledWith('/auth/verify-reset-code', { resetToken: '937598' });
            expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.AUTH.RESET_PASSWORD}?token=937598`);
        });
    });
});
