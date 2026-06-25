import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
import api from '@/utils/api';
import { ROUTES } from '@/routes/constants';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = React.useState<1 | 2>(1);
    const [loading, setLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');

    const form = useForm<{ email: string; code: string }>({
        resolver: zodResolver(
            z.object({
                email: z.string().email('Please enter a valid email address'),
                code: z.string(),
            })
        ),
        defaultValues: { email: '', code: '' },
        mode: 'onChange',
    });

    const onEmailSubmit = async (data: { email: string }) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/forgot-password', { email: data.email });
            const code = response.data.resetToken;
            if (code) {
                form.setValue('code', code)
            }
            setEmail(data.email);
            setStep(2);
            toast.success('Verification code sent!');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to send reset code';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const onVerifyCode = async (data: { code: string }) => {
        if (!data.code || data.code.length !== 6) {
            toast.error('Please enter a 6-digit verification code.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/verify-reset-code', { resetToken: data.code });
            toast.success('Code verified! Set your new password.');

            localStorage.removeItem('resetToken');
            localStorage.removeItem('resetEmail');

            navigate(`${ROUTES.AUTH.RESET_PASSWORD}?token=${data.code}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid verification code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container flex items-center justify-center min-h-screen relative z-10 px-4">
            <Card className="w-full max-w-md glass-card shadow-2xl border-white/10 overflow-hidden">
                <div className="pt-8 flex flex-col items-center">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#5606ff] to-[#fe8989] flex items-center justify-center text-white font-bold text-3xl shadow-2xl mb-4 animate-pulse-subtle">
                        I
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
                        Task Flow
                    </h1>
                    <p className="text-white/60 text-sm font-medium">Reset your journey</p>
                </div>
                <CardHeader className="pt-6 space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight text-white">
                        {step === 1 ? 'Forgot Password' : 'Verify Code'}
                    </CardTitle>
                    <CardDescription className="text-white/60">
                        {step === 1
                            ? "Enter your email address to receive a verification code."
                            : `Enter the code sent to ${email}`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        {step === 1 ? (
                            <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="you@example.com"
                                                    className="h-11"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full h-11 bg-gradient-to-r from-[#5606ff] to-[#fe8989] hover:opacity-90 transition-all font-bold rounded-xl shadow-[0_0_20px_rgba(86,6,255,0.3)]" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Verification Code'}
                                </Button>
                            </form>
                        ) : (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    onVerifyCode(form.getValues());
                                }}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-center block w-full text-sm font-bold text-[#fe8989] tracking-widest uppercase">
                                                Verification Code
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    aria-label="6-digit verification code"
                                                    type="text"
                                                    placeholder="000000"
                                                    maxLength={6}
                                                    autoFocus
                                                    className="text-center text-4xl font-black h-20 tracking-[0.3em] glass border-white/20 text-white focus:ring-[#5606ff]/30 rounded-2xl"
                                                    {...field}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                        field.onChange(val);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="space-y-3">
                                    <Button type="submit" className="w-full h-12 bg-gradient-to-r from-[#5606ff] to-[#fe8989] hover:opacity-90 transition-all font-bold rounded-xl shadow-[0_0_20px_rgba(86,6,255,0.3)]" disabled={loading}>
                                        {loading ? 'Verifying...' : 'Verify Code'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full h-10 text-xs text-white/40 hover:text-white hover:bg-white/5 transition-all rounded-xl"
                                        onClick={() => 
                                            {setStep(1)
                                        form.setValue('code', ' ')
                                        form.setValue('email', ' ')}
                                            }
                                    >
                                        Use a different email address
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Form>
                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <Link to={ROUTES.AUTH.SIGN_IN} className="text-sm font-bold text-white/60 hover:text-white transition-colors">
                            Back to Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
