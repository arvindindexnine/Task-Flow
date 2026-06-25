import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStore } from '@/utils/store';
import { useTranslation } from 'react-i18next';

export const TaskStatusChart: React.FC = () => {
    const { t } = useTranslation(['dashboard', 'tasks']);
    const tasks = useTaskStore((state) => state.tasks);

    const pending = tasks.filter(t => t.status === 'TODO').length;
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;

    const data = {
        labels: [t('tasks:status.todo'), t('tasks:status.inProgress'), t('tasks:status.completed')],
        datasets: [
            {
                data: [pending, inProgress, completed],
                backgroundColor: [
                    'rgba(254, 137, 137, 0.8)', // Coral/Pink (#fe8989)
                    'rgba(59, 130, 246, 0.8)', // Blue
                    'rgba(52, 211, 153, 0.8)', // Emerald
                ],
                borderColor: [
                    'rgba(255, 255, 255, 0.1)',
                    'rgba(255, 255, 255, 0.1)',
                    'rgba(255, 255, 255, 0.1)',
                ],
                hoverOffset: 10,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    boxWidth: 8,
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        family: 'Inter',
                        size: 11,
                        weight: 600,
                    }
                }
            },
        },
        cutout: '75%',
    };

    return (
        <Card className="glass-card shadow-2xl border-white/5">
            <CardHeader>
                <CardTitle className="text-sm font-bold tracking-tight text-white/80">{t('charts.status')}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
                <div className="h-[250px] w-full max-w-[250px]">
                    <Doughnut data={data} options={options} />
                </div>
            </CardContent>
        </Card>
    );
};
