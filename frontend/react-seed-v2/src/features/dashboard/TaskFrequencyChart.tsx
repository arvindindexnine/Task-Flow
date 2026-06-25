import * as React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStore } from '@/utils/store';
import { format, subDays, isSameDay } from 'date-fns';
import { useTranslation } from 'react-i18next';

export const TaskFrequencyChart: React.FC = () => {
    const { t } = useTranslation('dashboard');
    const tasks = useTaskStore((state) => state.tasks);

    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();

    const data = {
        labels: last7Days.map(date => format(date, 'MMM dd')),
        datasets: [
            {
                label: t('charts.frequencyLabel'),
                data: last7Days.map(date =>
                    tasks.filter(task => task.createdAt && isSameDay(new Date(task.createdAt), date)).length
                ),
                borderColor: '#5606ff',
                backgroundColor: 'rgba(86, 6, 255, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#fe8989',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' as const },
                bodyFont: { size: 13 },
                displayColors: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    color: 'rgba(255, 255, 255, 0.5)',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                }
            },
            x: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.5)',
                },
                grid: {
                    display: false,
                }
            }
        },
    };

    return (
        <Card className="md:col-span-2 glass-card shadow-2xl border-white/5">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold tracking-tight text-white/80">{t('charts.frequency')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full mt-4">
                    <Line data={data} options={options} />
                </div>
            </CardContent>
        </Card>
    );
};
