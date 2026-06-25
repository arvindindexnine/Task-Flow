import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, ShieldCheck, LayoutDashboard, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { signInSchema, type SignInInput } from '@/utils/form';
import { useAuthStore } from '@/utils/store';
import api from '@/utils/api';
import type { AuthResponse } from '@/utils/types';

const SignIn: React.FC = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isAdminMode, setIsAdminMode] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInInput) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        ...data,
        isAdmin: isAdminMode,
      });
      const { token, user } = response.data;
      setAuth(token, user);
      navigate('/');
    } catch (error: any) {
      const responseData = error.response?.data;
      let message = responseData?.message;

      // Handle NestJS array messages
      if (Array.isArray(message)) {
        message = message[0];
      }

      const lowerMessage = typeof message === 'string' ? message.toLowerCase() : '';

      if (lowerMessage.includes('pending')) {
        toast.error("Your account is pending approval. Please contact administrator.");
      } else if (
        lowerMessage.includes('portal') ||
        lowerMessage.includes('administrator') ||
        lowerMessage.includes('admin')
      ) {
        toast.error(message);
      } else if (error.response?.status === 401) {
        toast.error("Invalid email or password.");
      } else {
        toast.error(message || "Something went wrong. Please try again.");
      }
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
          <p className="text-white/60 text-sm font-medium">by Indexnine</p>
        </div>
        <CardHeader className="pt-6">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            {isAdminMode ? (
              <span className="flex items-center gap-2 text-[#fe8989]">
                <ShieldCheck className="h-5 w-5" />
                Admin Access
              </span>
            ) : (
              <span className="flex items-center gap-2 text-white/90">
                <User className="h-5 w-5" />
                Welcome Back
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signIn.email')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>{t('signIn.password')}</FormLabel>
                    </div>
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
                    <div className="mt-1">
                      <Link
                        to="/auth/forgot-password"
                        className="text-xs text-primary hover:underline hover:text-primary/80"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-[#5606ff] to-[#fe8989] hover:opacity-90 transition-opacity font-bold rounded-xl shadow-[0_0_20px_rgba(86,6,255,0.3)]">
                {t('signIn.submit')}
              </Button>

              <div className="flex flex-col space-y-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className="text-sm border-white/10 glass hover:bg-white/5 rounded-xl h-10"
                >
                  {isAdminMode ? (
                    <span className="flex items-center gap-2 text-white/80">
                      <User className="h-4 w-4" /> Switch to Member Login
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-white/80">
                      <LayoutDashboard className="h-4 w-4" /> Go to Admin Portal
                    </span>
                  )}
                </Button>

                <p className="text-center text-sm text-white/60">
                  {t('signIn.noAccount')}{' '}
                  <Link to="/auth/sign-up" className="text-[#fe8989] font-bold hover:underline decoration-2 underline-offset-4">
                    {t('signIn.signUp')}
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn; 