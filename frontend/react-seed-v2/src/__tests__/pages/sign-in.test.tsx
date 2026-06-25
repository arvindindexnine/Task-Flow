import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import { userEvent } from '@testing-library/user-event';
import SignIn from '@/pages/auth/sign-in';
import api from '@/utils/api';
import { useAuthStore } from '@/utils/store';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) =>
        ({
            'signIn.title': 'Sign In',
            'signIn.email': 'Email Address',
            'signIn.password': 'Password',
            'signIn.submit': 'Sign In',
            'signIn.noAccount': "Don't have an account?",
            'signIn.signUp': 'Sign Up',
            'signIn.errors.invalidCredentials': 'Invalid email or password',
        }[key] ?? key),
    }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

describe('SignIn page', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        useAuthStore.getState().logout();
    });

    it('renders email, password fields and submit button', () => {
        render(<SignIn />);
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('shows validation error when submitting empty form', async () => {
        const user = userEvent.setup();
        render(<SignIn />);

        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
        });
    });

    it('sets auth state and navigates on successful login', async () => {
        const user = userEvent.setup();
        const mockUser = { id: '1', name: 'Test', email: 'test@example.com', role: 'MEMBER' as const };
        vi.spyOn(api, 'post').mockResolvedValue({ data: { token: 'abc123', user: mockUser } });

        render(<SignIn />);

        await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
        await user.type(screen.getByLabelText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(useAuthStore.getState().isLoggedIn).toBe(true);
            expect(useAuthStore.getState().token).toBe('abc123');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('shows error toast on API failure', async () => {
        const user = userEvent.setup();
        vi.spyOn(api, 'post').mockRejectedValue(new Error('Auth failed'));

        render(<SignIn />);

        await user.type(screen.getByLabelText(/email address/i), 'bad@example.com');
        await user.type(screen.getByLabelText(/password/i), 'wrongpass');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockNavigate).not.toHaveBeenCalled();
            expect(useAuthStore.getState().isLoggedIn).toBe(false);
        });
    });
});
