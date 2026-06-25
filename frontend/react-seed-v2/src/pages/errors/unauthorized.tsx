import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes/constants';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center px-4">
            <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-destructive/10 p-5">
                    <ShieldOff className="h-10 w-10 text-destructive" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
                <p className="max-w-sm text-muted-foreground text-sm leading-relaxed">
                    You don't have the required permissions to view this page.
                    Contact your administrator if you believe this is a mistake.
                </p>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    Go Back
                </Button>
                <Button onClick={() => navigate(ROUTES.HOME)}>
                    Go to Home
                </Button>
            </div>
        </div>
    );
};

export default Unauthorized;
