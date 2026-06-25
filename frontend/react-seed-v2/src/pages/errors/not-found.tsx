import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/constants';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="mb-8">The page you are looking for does not exist.</p>
            <button
                onClick={() => navigate(ROUTES.HOME)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
                Go Home
            </button>
        </div>
    );
};

export default NotFound;
