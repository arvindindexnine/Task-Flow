import { ApiProperty } from '@nestjs/swagger';

export class MessageDTO {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: any;

  constructor(message: string, data?: any) {
    this.message = message;
    this.data = data;
  }
}
