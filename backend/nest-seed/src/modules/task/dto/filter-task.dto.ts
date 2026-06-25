import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../../../dto/pager.dto';
import { TaskPriority, TaskStatus } from '../../../constants/task.constant';

export class FilterTaskDto extends PaginationDto {
  @ApiPropertyOptional({ enum: TaskStatus, description: 'Filter by task status' })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority, description: 'Filter by task priority' })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({ description: 'Filter tasks due on or after this date (ISO 8601)' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueDateStart?: Date;

  @ApiPropertyOptional({ description: 'Filter tasks due on or before this date (ISO 8601)' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueDateEnd?: Date;

  @ApiPropertyOptional({ description: 'Filter tasks by title or description' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Sort direction for dueDate', enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}
