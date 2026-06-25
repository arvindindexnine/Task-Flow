import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { resetPasswordSchema, type ResetPasswordInput } from '@/utils/form';
import api from '@/utils/api';
import { ROUTES } from '@/routes/constants';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const tokenFromUrl = searchParams.get('token') ?? localStorage.getItem('resetToken') ?? '';

    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: tokenFromUrl,
            password: '',
            confirmPassword: '',
        },
    });

    React.useEffect(() => {
        if (!searchParams.get('token') && localStorage.getItem('resetToken')) {
            toast.info('Verification code applied from local storage.', {
                description: 'We found your last generated code.',
                duration: 5000,
            });
        }
    }, [searchParams]);

    const onSubmit = async (data: ResetPasswordInput) => {
        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                resetToken: data.token || tokenFromUrl,
                newPassword: data.password,
            });
            toast.success('Password reset successfully. Please sign in.');
            localStorage.removeItem('resetToken');
            localStorage.removeItem('resetEmail');
            navigate(ROUTES.AUTH.SIGN_IN);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container flex items-center justify-center min-h-screen relative z-10 px-4">
            <Card className="w-full max-w-md glass-card shadow-2xl border-white/10 overflow-hidden">
                <div className="pt-8 flex flex-col items-center">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#5606ff] to-[#fe8989] flex items-center justify-center text-white font-bold text-3xl shadow-2xl mb-4 animate-bounce-subtle">
                        I
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
                        Task Flow
                    </h1>
                    <p className="text-white/60 text-sm font-medium">Reset your journey</p>
                </div>
                <CardHeader className="pt-6 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight text-white">Reset Password</CardTitle>
                    <CardDescription className="text-white/60">Enter your new password below to regain access.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {!tokenFromUrl && (
                                <FormField
                                    control={form.control}
                                    name="token"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reset Token (Verification Code)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter the 6-digit code" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    {...field}
                                                    className="pr-10"
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    {...field}
                                                    className="pr-10"
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full h-11 bg-gradient-to-r from-[#5606ff] to-[#fe8989] hover:opacity-90 transition-all font-bold rounded-xl shadow-[0_0_20px_rgba(86,6,255,0.3)]" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                            <p className="text-center text-sm pt-2">
                                <Link to={ROUTES.AUTH.SIGN_IN} className="text-[#fe8989] font-bold hover:underline decoration-2 underline-offset-4">
                                    Back to Sign In
                                </Link>
                            </p>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;
