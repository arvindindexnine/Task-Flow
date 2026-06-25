import { ApiResponseProperty } from '@nestjs/swagger';

import { Pager } from '../../../dto/pager.dto';
import { Task } from '../task.entity';

export class TaskResponseDto {
  @ApiResponseProperty({ type: () => [Task] })
  tasks: Task[];

  @ApiResponseProperty({ type: () => Pager })
  pager: Pager;
}
