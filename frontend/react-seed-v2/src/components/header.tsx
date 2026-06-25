import * as React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useAuthStore } from '@/utils/store';
import { ROUTES } from '@/routes/constants';

export const Header: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const handleSignOut = () => {
    logout();
    navigate(ROUTES.AUTH.SIGN_IN);
  };

  const navLinkClass = 'text-sm font-bold text-white/60 hover:text-white transition-all duration-300 hover:scale-105';

  return (
    <header className="border-b border-white/5 glass sticky top-0 z-50 backdrop-blur-2xl transition-all duration-300">
      <div className="container flex h-16 md:h-20 items-center gap-4 px-4 overflow-hidden">
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2 group shrink-0">
          <div className="h-9 w-9 md:h-11 md:w-11 rounded-xl bg-gradient-to-br from-[#5606ff] to-[#fe8989] flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg group-hover:scale-105 transition-transform">
            I
          </div>
          <span className="text-xl font-bold tracking-tight text-brand-gradient hidden lg:block">
            Indexnine Task Flow
          </span>
        </Link>

        {/* Navigation - Centered or fluid */}
        <nav className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar py-1 flex-1 px-2 mask-linear-fade">
          <Link to={ROUTES.DASHBOARD} className={`${navLinkClass} ${location.pathname === ROUTES.DASHBOARD ? 'text-primary' : ''}`}>
            {t('header.dashboard')}
          </Link>
          <Link to={ROUTES.TASKS} className={`${navLinkClass} ${location.pathname === ROUTES.TASKS ? 'text-primary' : ''}`}>
            {t('header.tasks')}
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold hover:bg-primary/20 transition-all border border-primary/20 shrink-0"
            >
              <ShieldCheck className="h-3 w-3 md:h-3.5 md:w-3.5" />
              <span>{t('header.admin')}</span>
            </Link>
          )}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
          <div className="block">
            <LanguageSwitcher />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl text-[10px] md:text-sm font-bold h-8 md:h-10 px-2 md:px-4 glass hover:bg-white/10 text-white/70 hover:text-white transition-all"
            asChild
          >
            <Link to={ROUTES.CHANGE_PASSWORD}>
              <span className="hidden md:inline">{t('header.changePassword')}</span>
              <span className="md:hidden uppercase tracking-widest text-[8px]">Pwd</span>
            </Link>
          </Button>
          <Button
            variant="default"
            size="sm"
            className="rounded-xl text-[10px] md:text-sm font-bold h-8 md:h-10 px-3 md:px-5 bg-gradient-to-r from-[#5606ff] to-[#fe8989] hover:opacity-90 shadow-lg transition-all"
            onClick={handleSignOut}
          >
            {t('header.signOut')}
          </Button>
        </div>
      </div>
    </header>
  );
};