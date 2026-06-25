import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import api from '@/utils/api';
import type { Task, PaginatedResponse } from '@/utils/types';

interface UserTasksPanelProps {
    userId: number;
}

const UserTasksPanel: React.FC<UserTasksPanelProps> = ({ userId }) => {
    const { t } = useTranslation(['admin', 'tasks']);
    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [statusFilter, setStatusFilter] = React.useState<string>('all');
    const [priorityFilter, setPriorityFilter] = React.useState<string>('all');

    const fetchTasks = React.useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (statusFilter !== 'all') params.status = statusFilter;
            if (priorityFilter !== 'all') params.priority = priorityFilter;

            const response = await api.get<PaginatedResponse<Task>>(`/tasks/user/${userId}`, { params });
            const data = response.data as any;
            setTasks(data.tasks || []);
        } catch (error) {
            console.error('Failed to fetch user tasks', error);
        } finally {
            setLoading(false);
        }
    }, [userId, statusFilter, priorityFilter]);

    React.useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    if (loading && tasks.length === 0) {
        return (
            <div className="flex justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#fe8989] border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Minimal Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mr-0 sm:mr-4">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#fe8989] shadow-[0_0_8px_#fe8989]" />
                    <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">{t('admin:management.filters')}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-10 glass border-white/5 text-[10px] font-bold uppercase tracking-wider text-white rounded-xl focus:ring-[#5606ff]/30">
                            <SelectValue placeholder={t('tasks:filters.status')} />
                        </SelectTrigger>
                        <SelectContent className="glass-dark border-white/10 text-white">
                            <SelectItem value="all">{t('tasks:filters.all')}</SelectItem>
                            <SelectItem value="TODO">{t('tasks:status.todo')}</SelectItem>
                            <SelectItem value="IN_PROGRESS">{t('tasks:status.inProgress')}</SelectItem>
                            <SelectItem value="COMPLETED">{t('tasks:status.completed')}</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="h-10 glass border-white/5 text-[10px] font-bold uppercase tracking-wider text-white rounded-xl focus:ring-[#5606ff]/30">
                            <SelectValue placeholder={t('tasks:filters.priority')} />
                        </SelectTrigger>
                        <SelectContent className="glass-dark border-white/10 text-white">
                            <SelectItem value="all">{t('tasks:filters.all')}</SelectItem>
                            <SelectItem value="LOW">{t('tasks:priority.low')}</SelectItem>
                            <SelectItem value="MEDIUM">{t('tasks:priority.medium')}</SelectItem>
                            <SelectItem value="HIGH">{t('tasks:priority.high')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {tasks.length === 0 ? (
                <div className="py-16 text-center text-white/30 italic glass border-white/5 rounded-3xl border-dashed">
                    {t('tasks:noTasksMatchFilters')}
                </div>
            ) : (
                <div className="grid gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {tasks.map((task) => (
                        <Card key={task.id} className="glass-card border-white/5 shadow-none group hover:bg-white/5 transition-all duration-500 rounded-2xl relative overflow-hidden">
                            <div className="absolute right-0 top-0 h-16 w-16 bg-gradient-to-br from-[#5606ff] to-[#fe8989] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
                            <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 min-w-0">
                                    <span className="font-bold text-white text-base truncate w-full group-hover:text-[#5606ff] transition-colors">{task.title}</span>
                                    {task.description && (
                                        <span className="text-xs text-white/40 font-medium line-clamp-1 max-w-[400px]">
                                            {task.description}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Badge
                                        className={`border-none px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase ${task.priority === 'HIGH' ? 'bg-rose-400/20 text-rose-400 ring-1 ring-rose-400/30' : 'bg-white/5 text-white/60'
                                            }`}
                                    >
                                        {t(`tasks:priority.${task.priority.toLowerCase()}`)}
                                    </Badge>
                                    <Badge
                                        className="bg-[#5606ff]/20 text-[#5606ff] border-none px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase ring-1 ring-[#5606ff]/30"
                                    >
                                        {t(`tasks:status.${task.status === 'IN_PROGRESS' ? 'inProgress' : task.status.toLowerCase()}`)}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserTasksPanel;
