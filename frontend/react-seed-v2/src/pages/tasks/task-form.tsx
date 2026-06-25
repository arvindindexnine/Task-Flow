import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/utils/store';
import type { Task } from '@/utils/types';
import { taskSchema, type TaskInput } from '@/utils/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

interface TaskFormProps {
    task?: Task;
    onSubmit: (data: TaskInput) => Promise<void>;
    onCancel: () => void;
    loading: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, loading }) => {
    const { t } = useTranslation(['tasks', 'common']);
    const isEdit = Boolean(task);
    const user = useAuthStore((state) => state.user);

    const form = useForm<TaskInput>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: task?.title ?? '',
            description: task?.description ?? '',
            status: task?.status ?? 'TODO',
            priority: task?.priority ?? 'MEDIUM',
            dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
        },
    });

    const handleSubmit = async (data: TaskInput) => {
        await onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                {/* Title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white/60 font-bold uppercase text-[10px] tracking-widest pl-1">{t('form.labels.title')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('form.placeholders.title')} {...field} className="glass border-white/10 text-white h-11 rounded-xl focus:ring-[#5606ff]/30" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white/60 font-bold uppercase text-[10px] tracking-widest pl-1">{t('form.labels.description')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('form.placeholders.description')} {...field} className="glass border-white/10 text-white h-11 rounded-xl focus:ring-[#5606ff]/30" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Status + Priority — side by side on desktop, stacked on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white/60 font-bold uppercase text-[10px] tracking-widest pl-1">{t('form.labels.status')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full glass border-white/10 text-white h-11 rounded-xl focus:ring-[#5606ff]/30">
                                            <SelectValue placeholder={t('status.todo')} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="glass-dark border-white/10 text-white">
                                        <SelectItem value="TODO">{t('status.todo')}</SelectItem>
                                        <SelectItem value="IN_PROGRESS">{t('status.inProgress')}</SelectItem>
                                        <SelectItem value="COMPLETED">{t('status.completed')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Priority */}
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white/60 font-bold uppercase text-[10px] tracking-widest pl-1">{t('form.labels.priority')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full glass border-white/10 text-white h-11 rounded-xl focus:ring-[#5606ff]/30">
                                            <SelectValue placeholder={t('priority.medium')} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="glass-dark border-white/10 text-white">
                                        <SelectItem value="LOW">{t('priority.low')}</SelectItem>
                                        <SelectItem value="MEDIUM">{t('priority.medium')}</SelectItem>
                                        <SelectItem value="HIGH">{t('priority.high')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Due Date + Created By — side by side on desktop, stacked on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-white/60 font-bold uppercase text-[10px] tracking-widest pl-1">{t('form.labels.dueDate')}</FormLabel>
                                <FormControl>
                                    <Input type="date" className="w-full glass border-white/10 text-white h-11 rounded-xl focus:ring-[#5606ff]/30" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem className="w-full">
                        <FormLabel className="text-white/60 font-bold uppercase text-[10px] tracking-widest pl-1">Created By</FormLabel>
                        <FormControl>
                            <Input
                                value={user?.name || (task ? "Super Admin" : "Unknown")}
                                disabled
                                className="glass border-white/10 text-white/40 h-11 rounded-xl cursor-not-allowed opacity-60"
                            />
                        </FormControl>
                    </FormItem>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6">
                    <Button type="button" variant="ghost" className="h-12 px-6 glass hover:bg-white/5 text-white/60 hover:text-white border-white/10 font-bold rounded-xl w-full sm:w-auto order-2 sm:order-1 transition-all" onClick={onCancel} disabled={loading}>
                        {t('common:actions.cancel')}
                    </Button>
                    <Button type="submit" className="h-12 px-8 bg-gradient-to-r from-[#5606ff] to-[#fe8989] hover:opacity-90 transition-all font-bold rounded-xl shadow-[0_0_20px_rgba(86,6,255,0.3)] w-full sm:w-auto order-1 sm:order-2" disabled={loading}>
                        {loading ? '...' : isEdit ? t('form.editTask') : t('form.addTask')}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
