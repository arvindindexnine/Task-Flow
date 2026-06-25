import { HttpStatus, Injectable } from '@nestjs/common';
import { logger, SeedException } from '@snap/core';

import { getStartIndex } from '../../dto/pager.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    logger.debug(`[TaskService] Creating task for userId: ${userId}, Data: ${JSON.stringify(createTaskDto)}`);
    try {
      const task = new Task();
      task.title = createTaskDto.title;
      task.description = createTaskDto.description;
      if (createTaskDto.status) {
        task.status = createTaskDto.status;
      }
      if (createTaskDto.priority) {
        task.priority = createTaskDto.priority;
      }
      if (createTaskDto.dueDate) {
        task.dueDate = createTaskDto.dueDate;
      }
      task.userId = userId;

      const createdTask = await this.taskRepository.createTask(task);
      logger.debug(`[TaskService] Task created successfully: ${createdTask.id}`);
      return createdTask;
    } catch (error) {
      logger.error(`[TaskService] Error creating task:`, error);
      throw error;
    }
  }

  getTasks(userId: number, filterDto: FilterTaskDto): Promise<TaskResponseDto> {
    const page = filterDto.page || 1;
    const limit = filterDto.limit || 5;
    filterDto.page = page;
    filterDto.limit = limit;

    const startIndex = getStartIndex(page, limit);
    return this.taskRepository.findTasksWithFilterAndPagination(userId, filterDto, startIndex);
  }

  async getTaskById(userId: number, taskId: number): Promise<Task> {
    // Find task by ID first — 404 if it doesn't exist at all
    const task = await this.taskRepository.findTaskByIdOnly(taskId);

    if (!task) {
      throw new SeedException('Task not found', HttpStatus.NOT_FOUND);
    }

    // Ownership check — 403 if the task exists but belongs to another user
    if (task.userId !== userId) {
      throw new SeedException('You do not have permission to access this task', HttpStatus.FORBIDDEN);
    }

    return task;
  }

  async updateTask(userId: number, taskId: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(userId, taskId);

    // Filter out undefined fields to avoid unintended overwrites with nulls
    const filteredUpdateContext = Object.fromEntries(Object.entries(updateTaskDto).filter(([, value]) => value !== undefined));

    if (Object.keys(filteredUpdateContext).length === 0) {
      return task; // Nothing to update
    }

    await this.taskRepository.updateTask(taskId, userId, filteredUpdateContext);
    logger.info(`Task updated: ID ${taskId} by User ${userId}`);

    return this.taskRepository.findTaskById(taskId, userId);
  }

  async deleteTask(userId: number, taskId: number): Promise<void> {
    await this.getTaskById(userId, taskId);

    await this.taskRepository.deleteTask(taskId, userId);
    logger.info(`Task deleted: ID ${taskId} by User ${userId}`);
  }
}
