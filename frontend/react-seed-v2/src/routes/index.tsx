import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from './constants';
import { ProtectedRoute } from '@/components/protected-route';
import { AdminRoute } from '@/components/admin-route';
import { ProtectedLayout } from '@/components/layouts/protected-layout';
import ErrorPage from '@/pages/errors/general-error';
import NotFound from '@/pages/errors/not-found';
import Unauthorized from '@/pages/errors/unauthorized';

// Lazy load pages
const SignIn = lazy(() => import('@/pages/auth/sign-in'));
const SignUp = lazy(() => import('@/pages/auth/sign-up'));
const ForgotPassword = lazy(() => import('@/pages/auth/forgot-password'));
const ResetPassword = lazy(() => import('@/pages/auth/reset-password'));
const Dashboard = lazy(() => import('@/pages/dashboard'));
const AddUser = lazy(() => import('@/pages/users/add'));
const TaskPage = lazy(() => import('@/pages/tasks/task-page'));
const ChangePassword = lazy(() => import('@/pages/change-password'));
const AdminDashboard = lazy(() => import('@/features/admin/AdminDashboard'));

// Loading component
const Loading = () => (
    <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
);

export const router = createBrowserRouter([
    // ─── Public auth routes ──────────────────────────────────────────────────────
    {
        path: ROUTES.AUTH.ROOT,
        errorElement: <ErrorPage />,
        children: [
            {
                path: ROUTES.AUTH.SIGN_IN,
                element: (
                    <Suspense fallback={<Loading />}>
                        <SignIn />
                    </Suspense>
                ),
            },
            {
                path: ROUTES.AUTH.SIGN_UP,
                element: (
                    <Suspense fallback={<Loading />}>
                        <SignUp />
                    </Suspense>
                ),
            },
            {
                path: ROUTES.AUTH.FORGOT_PASSWORD,
                element: (
                    <Suspense fallback={<Loading />}>
                        <ForgotPassword />
                    </Suspense>
                ),
            },
            {
                path: ROUTES.AUTH.RESET_PASSWORD,
                element: (
                    <Suspense fallback={<Loading />}>
                        <ResetPassword />
                    </Suspense>
                ),
            },
            // Redirect /auth → /auth/sign-in
            {
                index: true,
                element: <Navigate to={ROUTES.AUTH.SIGN_IN} replace />,
            },
        ],
    },

    // ─── Unauthorized (public — no auth needed) ──────────────────────────────────
    {
        path: ROUTES.UNAUTHORIZED,
        element: <Unauthorized />,
        errorElement: <ErrorPage />,
    },

    // ─── Protected routes (require login) ───────────────────────────────────────
    {
        element: <ProtectedRoute />,
        errorElement: <ErrorPage />,
        children: [
            {
                element: <ProtectedLayout />,
                children: [
                    {
                        path: ROUTES.HOME,
                        element: <Navigate to={ROUTES.DASHBOARD} replace />,
                    },
                    {
                        path: ROUTES.DASHBOARD,
                        element: (
                            <Suspense fallback={<Loading />}>
                                <Dashboard />
                            </Suspense>
                        ),
                    },
                    {
                        path: ROUTES.TASKS,
                        element: (
                            <Suspense fallback={<Loading />}>
                                <TaskPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: ROUTES.CHANGE_PASSWORD,
                        element: (
                            <Suspense fallback={<Loading />}>
                                <ChangePassword />
                            </Suspense>
                        ),
                    },

                    // ─── Admin-only routes ───────────────────────────────────────
                    {
                        element: <AdminRoute />,
                        children: [
                            {
                                path: ROUTES.USERS.ADD,
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <AddUser />
                                    </Suspense>
                                ),
                            },
                            {
                                path: '/admin',
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <AdminDashboard />
                                    </Suspense>
                                ),
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // ─── 404 ────────────────────────────────────────────────────────────────────
    {
        path: '*',
        element: <NotFound />,
    },
]);
