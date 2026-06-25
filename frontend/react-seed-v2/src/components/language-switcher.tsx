import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation('common');

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select defaultValue={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[80px] md:w-[120px] h-8 md:h-10 glass border-white/10 text-white rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider focus:ring-[#5606ff]/30 transition-all">
        <SelectValue placeholder={t('language.select')} />
      </SelectTrigger>
      <SelectContent className="glass-dark border-white/10 text-white backdrop-blur-3xl">
        <SelectItem value="en" className="text-xs font-bold py-3 hover:bg-white/10 focus:bg-white/10 transition-colors uppercase tracking-widest">{t('language.en')}</SelectItem>
        <SelectItem value="fr" className="text-xs font-bold py-3 hover:bg-white/10 focus:bg-white/10 transition-colors uppercase tracking-widest">{t('language.fr')}</SelectItem>
      </SelectContent>
    </Select>
  );
}; 