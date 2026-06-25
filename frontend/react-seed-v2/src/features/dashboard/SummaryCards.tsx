import * as React from 'react';
import {
    CheckCircle2,
    Circle,
    Clock,
    ListTodo
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStore } from '@/utils/store';
import { useTranslation } from 'react-i18next';

export const SummaryCards: React.FC = () => {
    const { t } = useTranslation('dashboard');
    const tasks = useTaskStore((state) => state.tasks);

    const stats = [
        {
            label: t('stats.total'),
            value: tasks.length,
            icon: <ListTodo className="h-full w-full text-[#5606ff]" />,
            color: 'bg-[#5606ff]/10',
        },
        {
            label: t('stats.pending'),
            value: tasks.filter(t => t.status === 'TODO').length,
            icon: <Circle className="h-full w-full text-[#fe8989]" />,
            color: 'bg-[#fe8989]/10',
        },
        {
            label: t('stats.inProgress'),
            value: tasks.filter(t => t.status === 'IN_PROGRESS').length,
            icon: <Clock className="h-full w-full text-blue-400" />,
            color: 'bg-blue-400/10',
        },
        {
            label: t('stats.completed'),
            value: tasks.filter(t => t.status === 'COMPLETED').length,
            icon: <CheckCircle2 className="h-full w-full text-emerald-400" />,
            color: 'bg-emerald-400/10',
        },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.label} className="glass-card shadow-xl group cursor-default border-white/5 relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(86,6,255,0.15)]">
                    <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-3xl opacity-20 transition-all duration-500 group-hover:opacity-40 group-hover:scale-150 ${stat.color}`} />

                    <CardHeader className="flex flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0 pb-3 relative z-10">
                        <CardTitle className="text-[10px] md:text-sm font-black tracking-[0.2em] text-white/40 group-hover:text-white/70 transition-colors uppercase">{stat.label}</CardTitle>
                        <div className={`p-4 rounded-2xl ${stat.color} ring-1 ring-white/10 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 flex items-center justify-center`}>
                            <div className="h-6 w-6">{stat.icon}</div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center sm:items-start relative z-10 pt-2 pb-6">
                        <div className="text-5xl md:text-6xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform duration-500">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
