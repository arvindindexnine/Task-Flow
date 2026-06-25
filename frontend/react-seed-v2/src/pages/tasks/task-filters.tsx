import * as React from 'react';
import { useEffect, useState } from 'react';
import type { TaskFilters as Filters, TaskStatus, TaskPriority } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

interface TaskFiltersProps {
    filters: Filters;
    onChange: (filters: Partial<Filters>) => void;
    onReset: () => void;
}

export const TaskFiltersBar: React.FC<TaskFiltersProps> = ({ filters, onChange, onReset }) => {
    const { t } = useTranslation('tasks');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                onChange({ search: searchTerm, page: 1 });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, onChange, filters.search]);

    // Sync local search term if filters are reset externally
    useEffect(() => {
        setSearchTerm(filters.search || '');
    }, [filters.search]);

    const STATUS_OPTIONS: { label: string; value: TaskStatus | '' }[] = [
        { label: t('filters.all'), value: '' },
        { label: t('status.todo'), value: 'TODO' },
        { label: t('status.inProgress'), value: 'IN_PROGRESS' },
        { label: t('status.completed'), value: 'COMPLETED' },
    ];

    const PRIORITY_OPTIONS: { label: string; value: TaskPriority | '' }[] = [
        { label: t('filters.all'), value: '' },
        { label: t('priority.low'), value: 'LOW' },
        { label: t('priority.medium'), value: 'MEDIUM' },
        { label: t('priority.high'), value: 'HIGH' },
    ];

    const SORT_OPTIONS: { label: string; value: 'ASC' | 'DESC' }[] = [
        { label: t('table.dueDate') + ' ↑', value: 'ASC' },
        { label: t('table.dueDate') + ' ↓', value: 'DESC' },
    ];
    return (
        <div className="glass p-4 rounded-2xl border-white/5 shadow-inner">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                {/* Search input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                        placeholder={t('filters.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="glass border-white/5 text-white pl-10 rounded-xl h-11 focus-visible:ring-[#5606ff]/30"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <div className="flex flex-row gap-3">
                        {/* Status filter */}
                        <Select
                            value={filters.status ?? ''}
                            onValueChange={(val) => onChange({ status: val === 'all' ? '' : val as TaskStatus | '', page: 1 })}
                        >
                            <SelectTrigger className="glass bg-transparent border-white/5 text-white rounded-xl h-11 text-xs font-bold uppercase tracking-wider w-[150px]" aria-label={t('filters.status')}>
                                <SelectValue placeholder={t('table.status')} />
                            </SelectTrigger>
                            <SelectContent className="glass-dark border-white/10 text-white">
                                {STATUS_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value === '' ? 'all' : opt.value} className="hover:bg-white/10 focus:bg-white/10">
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Priority filter */}
                        <Select
                            value={filters.priority ?? ''}
                            onValueChange={(val) => onChange({ priority: val === 'all' ? '' : val as TaskPriority | '', page: 1 })}
                        >
                            <SelectTrigger className="glass bg-transparent border-white/5 text-white rounded-xl h-11 text-xs font-bold uppercase tracking-wider w-[150px]" aria-label={t('filters.priority')}>
                                <SelectValue placeholder={t('table.priority')} />
                            </SelectTrigger>
                            <SelectContent className="glass-dark border-white/10 text-white">
                                {PRIORITY_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value === '' ? 'all' : opt.value} className="hover:bg-white/10 focus:bg-white/10">
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-row gap-3">
                        {/* Sort order */}
                        <Select
                            value={filters.sortOrder ?? 'ASC'}
                            onValueChange={(val) => onChange({ sortOrder: val as 'ASC' | 'DESC', page: 1 })}
                        >
                            <SelectTrigger className="glass bg-transparent border-white/5 text-white rounded-xl h-11 text-xs font-bold uppercase tracking-wider w-[150px]" aria-label={t('table.dueDate')}>
                                <SelectValue placeholder={t('table.dueDate')} />
                            </SelectTrigger>
                            <SelectContent className="glass-dark border-white/10 text-white">
                                {SORT_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value} className="hover:bg-white/10 focus:bg-white/10">
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="ghost" onClick={onReset} className="h-11 w-[150px] glass hover:bg-white/10 text-white rounded-xl border-white/5 text-xs font-bold uppercase tracking-wider transition-all">
                            {t('filters.reset')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
