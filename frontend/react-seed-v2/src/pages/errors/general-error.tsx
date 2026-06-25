import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { ROUTES } from '@/routes/constants';

const ErrorPage: React.FC = () => {
    const error = useRouteError();
    let errorMessage: string;

    if (isRouteErrorResponse(error)) {
        // error is type `ErrorResponse`
        errorMessage = error.statusText || error.data?.message || 'Unknown error';
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        console.error(error);
        errorMessage = 'Unknown error';
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-900">
            <h1 className="text-4xl font-bold mb-4">Oops!</h1>
            <p className="mb-4">Sorry, an unexpected error has occurred.</p>
            <p className="italic mb-8">
                <i>{errorMessage}</i>
            </p>
            <Link
                to={ROUTES.HOME}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
                Go Home
            </Link>
        </div>
    );
};

export default ErrorPage;
