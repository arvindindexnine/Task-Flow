import * as React from 'react';
import { SummaryCards } from './SummaryCards';
import { TaskFrequencyChart } from './TaskFrequencyChart';
import { TaskStatusChart } from './TaskStatusChart';
import { useTaskStore, useAuthStore } from '@/utils/store';
import { LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const UserDashboard: React.FC = () => {
    const { t } = useTranslation('dashboard');
    const fetchTasks = useTaskStore((state) => state.fetchTasks);
    const user = useAuthStore((state) => state.user);

    React.useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return (
        <div className="container py-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
                    <div className="p-4 bg-gradient-to-br from-[#5606ff] to-[#fe8989] rounded-2xl shadow-xl ring-1 ring-white/20 transform hover:scale-110 transition-transform duration-500">
                        <LayoutDashboard className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            {t('title')}
                        </h1>
                        <p className="text-white/50 font-medium max-w-md mx-auto sm:mx-0">
                            {t('welcome')} <span className="text-[#fe8989] font-extrabold">{user?.name}</span>. {t('overview')}
                        </p>
                    </div>
                </div>
            </div>

            <SummaryCards />

            <div className="grid gap-6 md:grid-cols-3">
                <TaskFrequencyChart />
                <TaskStatusChart />
            </div>
        </div>
    );
};

export default UserDashboard;
