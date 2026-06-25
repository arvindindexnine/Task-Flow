import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
    const { t } = useTranslation('common');
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex flex-wrap items-center gap-2 justify-center mt-12 py-6 border-t border-white/5" role="navigation" aria-label="Pagination">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="glass hover:bg-white/10 text-white/70 h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-20 transition-all"
                aria-label={t('actions.prev')}
            >
                ‹ {t('actions.prev')}
            </Button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-2xl bg-white/5 border-white/10">
                {pages.map((p) => (
                    <Button
                        key={p}
                        variant="ghost"
                        size="sm"
                        onClick={() => onPageChange(p)}
                        className={`h-7 w-7 md:h-8 md:w-8 p-0 rounded-lg text-[10px] md:text-xs font-black transition-all ${p === page
                                ? 'bg-gradient-to-br from-[#5606ff] to-[#fe8989] text-white shadow-lg'
                                : 'text-white/40 hover:text-white hover:bg-white/10'
                            }`}
                        aria-label={`Page ${p}`}
                        aria-current={p === page ? 'page' : undefined}
                    >
                        {p}
                    </Button>
                ))}
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="glass hover:bg-white/10 text-white/70 h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-20 transition-all"
                aria-label={t('actions.next')}
            >
                {t('actions.next')} ›
            </Button>
        </div>
    );
};
