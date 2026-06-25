import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';
import { CreateTaskDto } from '../modules/task/dto/create-task.dto';
import { FilterTaskDto } from '../modules/task/dto/filter-task.dto';
import { TaskResponseDto } from '../modules/task/dto/task-response.dto';
import { UpdateTaskDto } from '../modules/task/dto/update-task.dto';
import { Task } from '../modules/task/task.entity';
import { TaskService } from '../modules/task/task.service';

import { PermissionGuard, Permissions } from '../modules';

@Controller('tasks')
@ApiSecurity('BearerAuthorization')
@ApiTags('tasks')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('user/:userId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: TaskResponseDto,
    description: 'Admin viewing tasks of a specific user',
  })
  @Permissions({ resource: 'task', action: 'list' })
  getTasksByUserId(@Param('userId') userId: string, @Query() filterDto: FilterTaskDto): Promise<TaskResponseDto> {
    return this.taskService.getTasks(parseInt(userId, 10), filterDto);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Task,
    description: 'Task successfully created',
  })
  @Permissions({ resource: 'task', action: 'create' })
  createTask(@Req() req: any, @Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const { userId } = req.user;
    return this.taskService.createTask(userId, createTaskDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: TaskResponseDto,
    description: 'Filter and paginate tasks for the current user',
  })
  @Permissions({ resource: 'task', action: 'list' })
  getTasks(@Req() req: any, @Query() filterDto: FilterTaskDto): Promise<TaskResponseDto> {
    const { userId } = req.user;
    return this.taskService.getTasks(userId, filterDto);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Task,
    description: 'Retrieves a single task by ID for the current user',
  })
  @Permissions({ resource: 'task', action: 'get' })
  getTaskById(@Req() req: any, @Param('id') id: string): Promise<Task> {
    const { userId } = req.user;
    return this.taskService.getTaskById(userId, parseInt(id, 10));
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Task,
    description: 'Updates a specific task partially',
  })
  @Permissions({ resource: 'task', action: 'update' })
  updateTask(@Req() req: any, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { userId } = req.user;
    return this.taskService.updateTask(userId, parseInt(id, 10), updateTaskDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deletes a specific task',
  })
  @Permissions({ resource: 'task', action: 'delete' })
  async deleteTask(@Req() req: any, @Param('id') id: string): Promise<void> {
    const { userId } = req.user;
    await this.taskService.deleteTask(userId, parseInt(id, 10));
  }
}
