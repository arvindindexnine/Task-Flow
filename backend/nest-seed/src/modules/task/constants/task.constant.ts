export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// Whitelisted fields that are allowed as sort targets (prevents injection-class bugs)
export const TASK_SORTABLE_FIELDS = ['dueDate'] as const;
export type TaskSortableField = (typeof TASK_SORTABLE_FIELDS)[number];
