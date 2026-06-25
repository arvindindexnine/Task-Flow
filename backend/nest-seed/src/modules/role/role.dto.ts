import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RoleDTO {
  @ApiResponseProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class CreateRoleDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
