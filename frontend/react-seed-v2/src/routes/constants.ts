export const ROUTES = {
    AUTH: {
        ROOT: '/auth',
        SIGN_IN: '/auth/sign-in',
        SIGN_UP: '/auth/sign-up',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
    HOME: '/',
    DASHBOARD: '/dashboard',
    TASKS: '/tasks',
    CHANGE_PASSWORD: '/change-password',
    UNAUTHORIZED: '/unauthorized',
    USERS: {
        ADD: '/users/add',
    },
} as const;
