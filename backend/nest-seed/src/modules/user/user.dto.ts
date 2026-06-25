import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsPassword } from '@snap/core';
import { IsArray, IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Pager } from '../../dto/pager.dto';
import { RoleDTO } from '../role/role.dto';

export class CreateUserDTO {
  @IsEmail(
    {},
    {
      message: 'Invalid email',
    },
  )
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @IsPassword()
  password: string;

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  roles: string[];

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  constructor(email: string, password: string, roles: string[], name: string) {
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.name = name;
  }
}

export class UserDTO {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  roles: RoleDTO[];

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  status: string;

  @ApiResponseProperty()
  taskCount: number;
}

export class UserResponseDTO {
  @ApiResponseProperty()
  users: UserDTO[];

  @ApiResponseProperty()
  pager: Pager;

  @ApiResponseProperty()
  totalUsers: number;

  @ApiResponseProperty()
  totalTasks: number;

  @ApiResponseProperty()
  activeMembers: number;
}

export class UserResetPasswordDTO {
  @ApiProperty()
  newPassword: string;

  @ApiProperty()
  confirmPassword: string;
}

export class UserForgotPasswordDTO {
  @ApiProperty()
  email: string;
}

export class UserPassCodeDTO {
  @ApiResponseProperty()
  passCode: string;
}

export class UserChangePasswordDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  @MinLength(8)
  @MaxLength(32)
  @IsPassword()
  newPassword: string;
}

export class UserUpdateDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  roles: RoleDTO[];
}

export class CredentialsDTO {
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  isAdmin?: boolean;
}

export class ForgotPasswordResponseDTO {
  @ApiResponseProperty()
  resetToken: string;

  @ApiResponseProperty()
  expiresAt: Date;
}

export class ResetPasswordDTO {
  @ApiProperty()
  @IsNotEmpty()
  resetToken: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @IsPassword()
  newPassword: string;
}
