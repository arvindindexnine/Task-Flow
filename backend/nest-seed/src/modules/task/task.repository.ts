import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pager } from '../../dto/pager.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  createTask(task: Task): Promise<Task> {
    return this.taskRepository.save(task);
  }

  findTaskById(taskId: number, userId: number): Promise<Task> {
    return this.taskRepository.findOne({
      where: { id: taskId, userId },
    });
  }

  findTaskByIdOnly(taskId: number): Promise<Task> {
    return this.taskRepository.findOne({
      where: { id: taskId },
    });
  }

  findTasksByUser(userId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { userId },
    });
  }

  updateTask(taskId: number, userId: number, updateTaskDto: UpdateTaskDto) {
    return this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set({ ...updateTaskDto })
      .where('id = :taskId AND user_id = :userId', { taskId, userId })
      .execute();
  }

  deleteTask(taskId: number, userId: number) {
    return this.taskRepository.delete({ id: taskId, userId });
  }

  async findTasksWithFilterAndPagination(userId: number, filterDto: FilterTaskDto, startIndex: number): Promise<TaskResponseDto> {
    const { status, priority, dueDateStart, dueDateEnd, sortOrder, limit, page, search } = filterDto;

    const query = this.taskRepository.createQueryBuilder('task');
    query.where('task.user_id = :userId', { userId });

    if (search) {
      query.andWhere('(task.title ILIKE :search OR task.description ILIKE :search)', { search: `%${search}%` });
    }

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (priority) {
      query.andWhere('task.priority = :priority', { priority });
    }

    if (dueDateStart) {
      query.andWhere('task.due_date >= :dueDateStart', { dueDateStart });
    }

    if (dueDateEnd) {
      query.andWhere('task.due_date <= :dueDateEnd', { dueDateEnd });
    }

    if (search) {
      // Priority 1: Exact title match (highest)
      // Priority 2: Title starts with search
      // Priority 3: Title contains search
      // Priority 4: Description contains search
      query.addSelect(
        `CASE 
          WHEN task.title ILIKE :exactSearch THEN 1
          WHEN task.title ILIKE :startSearch THEN 2
          WHEN task.title ILIKE :search THEN 3
          ELSE 4
        END`,
        'relevance',
      );
      query.orderBy('relevance', 'ASC');
      query.addOrderBy('task.due_date', sortOrder || 'ASC', 'NULLS LAST');
      query.setParameters({
        exactSearch: search,
        startSearch: `${search}%`,
        search: `%${search}%`,
      });
    } else {
      // Sort by due_date only — it's the sole whitelisted sortable field
      const sortField = 'task.due_date';
      query.orderBy(sortField, sortOrder || 'ASC', 'NULLS LAST');
    }

    const totalCount = await query.getCount();

    const tasks = await query.take(limit).skip(startIndex).getMany();

    const pager = new Pager(totalCount, Number(page), Number(limit), startIndex);

    const taskResponse = new TaskResponseDto();
    taskResponse.tasks = tasks;
    taskResponse.pager = pager;

    return taskResponse;
  }
}
