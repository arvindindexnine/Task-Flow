import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, Info, ShieldCheck, User } from 'lucide-react';
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
import { signUpSchema, type SignUpInput } from '@/utils/form';
import api from '@/utils/api';
import type { AuthResponse } from '@/utils/types';

const SignUp: React.FC = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpInput) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        roles: isAdminMode ? ['ADMIN'] : ['MEMBER'],
      });

      const { user } = response.data;

      if (isAdminMode && user.status === 'PENDING') {
        toast.success(t('signUp.messages.adminPending'));
        navigate('/auth/sign-in');
      } else {
        toast.success(t('signUp.messages.memberSuccess'));
        navigate('/auth/sign-in');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('common:errors.somethingWentWrong'));
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
                {t('signUp.admin.title')}
              </span>
            ) : (
              <span className="flex items-center gap-2 text-white/90">
                <User className="h-5 w-5" />
                {t('signUp.admin.createAccount')}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAdminMode && (
            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg flex gap-3 animate-in slide-in-from-top-2 duration-300">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-primary">{t('signUp.admin.noticeTitle')}</p>
                <p className="text-muted-foreground mt-1">
                  {t('signUp.admin.noticeDescription')}
                </p>
              </div>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signUp.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signUp.email')}</FormLabel>
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
                    <FormLabel>{t('signUp.password')}</FormLabel>
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
                    <FormLabel>{t('signUp.confirmPassword')}</FormLabel>
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
              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-[#5606ff] to-[#fe8989] hover:opacity-90 transition-opacity font-bold rounded-xl shadow-[0_0_20px_rgba(86,6,255,0.3)]">
                {t('signUp.submit')}
              </Button>

              <div className="flex flex-col space-y-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className="text-sm border-white/10 glass hover:bg-white/5 rounded-xl h-10 text-white/80"
                >
                  {isAdminMode ? t('signUp.admin.switchToMember') : t('signUp.admin.switchToAdmin')}
                </Button>

                <p className="text-center text-sm text-white/60">
                  {t('signUp.haveAccount')}{' '}
                  <Link to="/auth/sign-in" className="text-[#fe8989] font-bold hover:underline decoration-2 underline-offset-4">
                    {t('signUp.signIn')}
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

export default SignUp; 