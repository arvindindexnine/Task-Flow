import * as React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import type { Task } from '@/utils/types';
import type { TaskInput } from '@/utils/form';
import { useTaskStore } from '@/utils/store';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { TaskFiltersBar } from './task-filters';
import { TaskList } from './task-list';
import { TaskForm } from './task-form';
import { Pagination } from './pagination';
import { useTranslation } from 'react-i18next';

const TaskPage: React.FC = () => {
    const { t } = useTranslation('tasks');
    const {
        tasks,
        meta,
        filters,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        setFilters,
    } = useTaskStore();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [formLoading, setFormLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Fetch whenever filters change
    useEffect(() => {
        fetchTasks();
        setSelectedIds([]);
    }, [filters, fetchTasks]);

    // Show API error via toast
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleToggleSelect = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) 
                ? prev.filter(taskId => taskId !== id)
                : [...prev, id]
        );
    };
    
    const handleToggleSelectAll = () => {
        if (selectedIds.length === tasks.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(tasks.map(task => task.id));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(t('messages.deleteSelectedConfirm'))) return;

        try {
            await Promise.all(selectedIds.map(id => deleteTask(id)));
            toast.success(t('messages.deleteSelectedSuccess'));
        } catch {
            toast.error(t('messages.deleteError'));
        }
    };

    const handleOpenCreate = () => {
        setEditingTask(undefined);
        setDialogOpen(true);
    };

    const handleOpenEdit = (task: Task) => {
        setEditingTask(task);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingTask(undefined);
    };

    const handleSubmitForm = async (data: TaskInput) => {
        setFormLoading(true);
        try {
            if (editingTask) {
                await updateTask(editingTask.id, {
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    priority: data.priority,
                    dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
                });
                toast.success(t('messages.updateSuccess'));
            } else {
                await createTask({
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    priority: data.priority,
                    dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
                });
                toast.success(t('messages.createSuccess'));
            }
            handleCloseDialog();
        } catch {
            // error is shown via the store's error → useEffect above
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm(t('messages.deleteConfirm'))) return;
        try {
            await deleteTask(id);
            toast.success(t('messages.deleteSuccess'));
        } catch {
            toast.error(t('messages.deleteError'));
        }
    };

    const handleResetFilters = () => {
        setFilters({ status: '', priority: '', search: '', page: 1, sortOrder: 'ASC' });
    };


    const handleQuickStatusToggle = async (task: Task) => {
        const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
        
        try {
            await updateTask(task.id, {
                title: task.title,
                description: task.description,
                status: newStatus,
                priority: task.priority,
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
            });
            
            toast.success(
                newStatus === 'COMPLETED' 
                    ? '✅ Task completed!' 
                    : '🔄 Task reopened'
            );
        } catch {
            toast.error('Failed to update task status');
        }
    };


    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 animate-in fade-in duration-700 relative z-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pb-4 border-b border-white/5">
                <div className="text-center sm:text-left space-y-2">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        {t('title')}
                    </h1>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                        <div className="h-1 w-8 bg-[#fe8989] rounded-full" />
                        <p className="text-white/40 font-medium italic">Manage and track your productivity flow</p>
                    </div>
                </div>
                <Button
                    onClick={handleOpenCreate}
                    id="create-task-btn"
                    className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-[#5606ff] to-[#fe8989] hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-300 font-bold rounded-xl shadow-[0_0_20px_rgba(86,6,255,0.3)] group"
                >
                    <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    {t('form.addTask')}
                </Button>
            </div>

            {/* Filters */}
            <TaskFiltersBar
                filters={filters}
                onChange={(partial) => setFilters(partial)}
                onReset={handleResetFilters}
            />

            {/* Task list */}
            <TaskList
                tasks={tasks}
                loading={loading}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onToggleSelect={handleToggleSelect}
                onSelectAll = {handleToggleSelectAll}
                selectedIds={selectedIds}
                onDeleteSelected = {handleDeleteSelected}
                onQuickToggle={handleQuickStatusToggle}
            />

            {/* Pagination */}
            <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                onPageChange={(page) => setFilters({ page })}
            />

            {/* Create / Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-lg bg-[#0d0d1a] border border-white/15 shadow-[0_0_60px_rgba(86,6,255,0.2)] backdrop-blur-2xl rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingTask ? t('form.editTask') : t('form.addTask')}</DialogTitle>
                    </DialogHeader>
                    <TaskForm
                        task={editingTask}
                        onSubmit={handleSubmitForm}
                        onCancel={handleCloseDialog}
                        loading={formLoading}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TaskPage;
