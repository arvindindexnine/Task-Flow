import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { TaskPriority, TaskStatus } from './constants/task.constant';
import { Pager } from '../../dto/pager.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let repository: Partial<TaskRepository>;

  const mockTask = new Task();
  mockTask.id = 1;
  mockTask.title = 'Test Task';
  mockTask.description = 'Test Description';
  mockTask.status = TaskStatus.TODO;
  mockTask.priority = TaskPriority.HIGH;
  mockTask.dueDate = new Date('2023-12-31');
  mockTask.userId = 1;

  beforeEach(async () => {
    repository = {
      createTask: jest.fn().mockResolvedValue(mockTask),
      findTasksWithFilterAndPagination: jest.fn().mockResolvedValue({
        tasks: [mockTask],
        pager: new Pager(1, 1, 10, 0),
      }),
      findTaskById: jest.fn().mockResolvedValue(mockTask),
      findTaskByIdOnly: jest.fn().mockResolvedValue(mockTask),
      updateTask: jest.fn().mockResolvedValue(undefined),
      deleteTask: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, { provide: TaskRepository, useValue: repository }],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  describe('createTask', () => {
    it('should create and return a task', async () => {
      const dto = new CreateTaskDto();
      dto.title = 'Test Task';

      const result = await service.createTask(1, dto);

      expect(repository.createTask).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });

    it('should map dueDate from DTO onto entity', async () => {
      const dto = new CreateTaskDto();
      dto.title = 'Test Task';
      dto.dueDate = new Date('2024-01-01');

      await service.createTask(1, dto);

      const taskArg = (repository.createTask as jest.Mock).mock.calls[0][0] as Task;
      expect(taskArg.dueDate).toEqual(dto.dueDate);
    });
  });

  describe('getTasks', () => {
    it('should return paginated tasks with defaults', async () => {
      const filter = new FilterTaskDto();
      const result = await service.getTasks(1, filter);

      expect(repository.findTasksWithFilterAndPagination).toHaveBeenCalledWith(1, filter, 0);
      expect(result.tasks).toEqual([mockTask]);
      expect(result.pager.totalItems).toEqual(1);
    });

    it('should apply page and limit from filter dto', async () => {
      const filter = new FilterTaskDto();
      filter.page = 2;
      filter.limit = 5;

      await service.getTasks(1, filter);

      expect(repository.findTasksWithFilterAndPagination).toHaveBeenCalledWith(1, filter, 5);
    });
  });

  describe('getTaskById', () => {
    it('should return task when found and owned', async () => {
      const result = await service.getTaskById(1, mockTask.id);
      expect(result).toEqual(mockTask);
    });

    it('should throw 404 when task not found', async () => {
      repository.findTaskByIdOnly = jest.fn().mockResolvedValue(null);

      await expect(service.getTaskById(1, 99)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw 403 when task belongs to another user', async () => {
      const otherUserTask = { ...mockTask, userId: 999 };
      repository.findTaskByIdOnly = jest.fn().mockResolvedValue(otherUserTask);

      await expect(service.getTaskById(1, mockTask.id)).rejects.toMatchObject({
        status: HttpStatus.FORBIDDEN,
      });
    });
  });

  describe('updateTask', () => {
    it('should update and return updated task', async () => {
      const dto = new UpdateTaskDto();
      dto.status = TaskStatus.IN_PROGRESS;

      const result = await service.updateTask(1, mockTask.id, dto);

      expect(repository.updateTask).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });

    it('should return the task unchanged if update DTO has no fields', async () => {
      const dto = new UpdateTaskDto();

      await service.updateTask(1, mockTask.id, dto);

      expect(repository.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should call deleteTask on repository with correct args', async () => {
      await service.deleteTask(1, mockTask.id);

      expect(repository.deleteTask).toHaveBeenCalledWith(mockTask.id, 1);
    });

    it('should throw if task not found for deletion', async () => {
      repository.findTaskByIdOnly = jest.fn().mockResolvedValue(null);

      await expect(service.deleteTask(1, 99)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });
});
