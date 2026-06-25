import { ApiProperty } from '@nestjs/swagger';

export class Metadata {
  @ApiProperty()
  startTime: number;

  @ApiProperty()
  endTime: number;

  @ApiProperty()
  apiProcessingTime: any;
}
