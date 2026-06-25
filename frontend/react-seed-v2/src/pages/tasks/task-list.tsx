import * as React from 'react';
import type { Task } from '@/utils/types';
import { TaskItem } from './task-item';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslation } from 'react-i18next';

interface TaskListProps {
    tasks: Task[];
    loading: boolean;
    onEdit: (task: Task) => void;
    onQuickToggle: (task: Task) => void;
    onDelete: (id: number) => void;
    onToggleSelect: (id: number) => void;
    onSelectAll: () => void;
    onDeleteSelected: () => void;
    selectedIds: number[];
}

export const TaskList: React.FC<TaskListProps> = ({ 
    tasks, 
    loading, 
    onEdit, 
    onQuickToggle,
    onDelete, 
    onToggleSelect, 
    onSelectAll, 
    onDeleteSelected, 
    selectedIds
}) => {
    const { t } = useTranslation('tasks');
    const allSelected = tasks.length > 0 && tasks.every((t) => selectedIds.includes(t.id));
    const someSelected = selectedIds.length > 0;
    
    if (loading) {
        return (
            <div className="flex items-center justify-center py-16" role="status" aria-label="Loading tasks">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <p className="text-lg font-medium">{t('noTasks')}</p>
                <p className="text-sm mt-1">{t('noTasksDescription')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Bulk Delete Banner */}
            {someSelected && (
                <div className="flex items-center justify-between px-4 py-3 glass rounded-xl border border-white/10">
                    <span className="text-sm text-white/70 font-medium">
                        {selectedIds.length} task{selectedIds.length > 1 ? 's' : ''} selected
                    </span>
                    <Button
                        variant="ghost"
                        onClick={onDeleteSelected}
                        className="h-9 px-4 text-destructive hover:bg-destructive/10 font-bold rounded-lg"
                    >
                        Delete Selected
                    </Button>
                </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden md:block glass rounded-2xl overflow-hidden border-white/10 shadow-2xl">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            
                            {/* Selection Checkbox Header */}
                            <TableHead className="w-12 py-6">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={onSelectAll}
                                    className="h-4 w-4 rounded accent-[#fe8989] cursor-pointer"
                                    title="Select all"
                                />
                            </TableHead>
                            
                            <TableHead className="text-white/70 font-bold py-6">{t('table.title')}</TableHead>
                            <TableHead className="text-white/70 font-bold">{t('table.description')}</TableHead>
                            <TableHead className="text-white/70 font-bold">{t('table.status')}</TableHead>
                            <TableHead className="text-white/70 font-bold">{t('table.priority')}</TableHead>
                            <TableHead className="text-white/70 font-bold">{t('table.dueDate')}</TableHead>
                            <TableHead className="text-white/70 font-bold text-right pr-6">{t('table.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TaskItem 
                                key={task.id} 
                                task={task} 
                                onEdit={onEdit} 
                                onQuickToggle={onQuickToggle}
                                onDelete={onDelete} 
                                isSelected={selectedIds.includes(task.id)} 
                                onToggleSelect={onToggleSelect}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {tasks.map((task) => {
                    const isCompleted = task.status === 'COMPLETED';
                    const isSelected = selectedIds.includes(task.id);
                    
                    return (
                        <div 
                            key={task.id} 
                            className={`glass-card rounded-3xl p-6 shadow-2xl space-y-5 border-white/10 group hover:border-[#5606ff]/30 transition-all duration-500 relative overflow-hidden ${isCompleted ? 'opacity-60' : ''}`}
                        >
                            <div className="absolute -right-12 -top-12 h-32 w-32 bg-gradient-to-br from-[#5606ff] to-[#fe8989] blur-3xl opacity-5 group-hover:opacity-20 transition-opacity duration-500" />

                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="flex justify-between items-start w-full">
                                    
                                    <div className="flex items-center gap-3">
                                        {/* Priority Badge */}
                                        <Badge className={`${task.priority === 'HIGH' ? 'bg-[#fe8989]/20 text-[#fe8989]' : 'bg-white/5 text-white/50'} border-none px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase`}>
                                            {t(`priority.${task.priority.toLowerCase()}`)}
                                        </Badge>
                                        
                                        {/* Selection Checkbox */}
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => onToggleSelect(task.id)}
                                            className="h-4 w-4 rounded accent-[#fe8989] cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Title with strikethrough */}
                                <div className="space-y-2">
                                    <h3 className={`font-black text-2xl text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60 ${isCompleted ? 'line-through opacity-50' : ''}`}>
                                        {task.title}
                                    </h3>
                                    <p className="text-sm text-white/40 leading-relaxed line-clamp-3">
                                        {task.description || t('noDescription')}
                                    </p>
                                </div>

                                <div className="w-full h-[1px] bg-white/5" />

                                <div className="flex flex-col items-center gap-4 w-full">
                                {/* Status Badge + Completion Checkbox on same line */}
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-[#5606ff]/20 text-[#5606ff] border-none px-5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase ring-1 ring-[#5606ff]/30">
                                        {t(`status.${task.status.toLowerCase().replace('_', 'InProgress')}`)}
                                    </Badge>
                                    
                                    {/* Completion Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={isCompleted}
                                        onChange={() => onQuickToggle(task)}
                                        className="h-4 w-4 rounded accent-[#5606ff] cursor-pointer"
                                        title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                                    />
                                </div>
                                
                                {/* Due Date */}
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 italic">
                                    <span>Due:</span>
                                    <span className="text-white/60">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : t('noDate')}
                                    </span>
                                </div>
                            </div>


                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => onEdit(task)} 
                                        className="h-9 w-9 p-0 glass hover:bg-white/10 text-white/70 hover:text-white rounded-xl transition-all"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => onDelete(task.id)} 
                                        className="h-9 w-9 p-0 glass hover:bg-rose-500/20 text-rose-500 rounded-xl transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Icon components
const Pencil = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
    </svg>
);

const Trash2 = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <line x1="10" x2="10" y1="11" y2="17" />
        <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
);
