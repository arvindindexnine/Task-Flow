import * as React from 'react';
import type { Task } from '@/utils/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/utils/store';
import { useTranslation } from 'react-i18next';

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onQuickToggle: (task: Task) => void;
    onDelete: (id: number) => void;
    isSelected: boolean;
    onToggleSelect: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ 
    task, 
    onEdit, 
    onQuickToggle,
    onDelete, 
    isSelected, 
    onToggleSelect 
}) => {
    const { t } = useTranslation('tasks');
    const user = useAuthStore((s) => s.user);

    const isAdmin = user?.role === 'ADMIN';
    const isOwner = user?.id !== undefined && String(user.id) === String(task.userId);

    const canEdit = isAdmin || isOwner;
    const canDelete = isAdmin || isOwner;

    const isCompleted = task.status === 'COMPLETED';
    
    const handleToggleComplete = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onQuickToggle(task);
    };

    return (
        <tr className={`border-b border-white/5 hover:bg-white/5 transition-all duration-300 group ${isSelected ? 'bg-[#5606ff]/10' : ''} ${isCompleted ? 'opacity-60' : ''}`}>
            {/* Selection Checkbox */}
            <td className="pl-6 py-5 w-12">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(task.id)}
                    className="h-4 w-4 rounded accent-[#fe8989] cursor-pointer"
                />
            </td>

            {/* Title with strikethrough when completed */}
            <td className="px-6 py-5">
                <div className={`font-bold text-white group-hover:text-[#fe8989] transition-colors ${isCompleted ? 'line-through opacity-50' : ''}`}>
                    {task.title}
                </div>
            </td>

            {/* Description */}
            <td className="px-4 py-5 text-sm text-white/50 max-w-xs truncate font-medium">
                {task.description ?? '—'}
            </td>

            {/* Status Badge + Completion Checkbox */}
            <td className="px-4 py-5">
                <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <Badge className="bg-white/10 text-white border-white/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                        {t(`status.${task.status.toLowerCase().replace('_', 'InProgress')}`)}
                    </Badge>
                    
                    {/* Completion Checkbox */}
                    <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={handleToggleComplete}
                        disabled={!canEdit}
                        className="h-4 w-4 rounded accent-[#5606ff] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                    />
                </div>
            </td>

            {/* Priority Badge */}
            <td className="px-4 py-5">
                <Badge className={`${task.priority === 'HIGH' ? 'bg-[#fe8989]/20 text-[#fe8989]' : 'bg-white/5 text-white/50'} border-none px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase`}>
                    {t(`priority.${task.priority.toLowerCase()}`)}
                </Badge>
            </td>

            {/* Due Date */}
            <td className="px-4 py-5 text-sm font-semibold text-white/40">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : t('noDate')}
            </td>

            {/* Actions */}
            <td className="px-6 py-5 text-right">
                <div className="flex items-center justify-end gap-2">
                    {canEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(task)}
                            aria-label={`Edit task ${task.title}`}
                            className="h-9 w-9 p-0 glass hover:bg-[#5606ff]/20 text-white rounded-lg border-white/10"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    )}
                    {canDelete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(task.id)}
                            aria-label={`Delete task ${task.title}`}
                            className="h-9 w-9 p-0 glass hover:bg-destructive/10 text-destructive/80 hover:text-destructive rounded-lg border-white/10"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </td>
        </tr>
    );
};
