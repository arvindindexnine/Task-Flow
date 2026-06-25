import { Body, Controller, Get, HttpStatus, Patch, Query, UseGuards, Post, Param, Delete } from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { logger } from '@snap/core';
import { PaginationDto } from '../dto/pager.dto';
import { PermissionGuard, Permissions } from '../modules';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';
import { MessageDTO } from '../dto/message.dto';
import { CreateUserDTO, UserChangePasswordDTO, UserDTO, UserResponseDTO } from '../modules/user/user.dto';
import { UserStatus } from '../modules/user/user.entity';
import { UserService } from '../modules/user/user.service';

@Controller('users')
@ApiSecurity('BearerAuthorization')
@ApiTags('users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDTO,
    description: 'UserDTO with user details',
  })
  @Permissions({ resource: 'user', action: 'get' })
  get(): Promise<UserDTO[]> {
    logger.debug('inside getUser');
    return this.userService.getUser();
  }

  @Get('list')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDTO,
    description: 'UserResponseDTO with user & pagination details',
  })
  @Permissions({ resource: 'user', action: 'list' })
  list(@Query() paginationDto: PaginationDto): Promise<UserResponseDTO> {
    if (!paginationDto.limit) {
      paginationDto.limit = 10;
    }
    if (!paginationDto.page) {
      paginationDto.page = 1;
    }
    return this.userService.list(paginationDto);
  }

  @Patch('change-password')
  @ApiResponse({
    status: HttpStatus.OK,
    type: MessageDTO,
    description: 'Message confirming password was changed',
  })
  @Permissions({ resource: 'user', action: 'update' })
  changePassword(@Body() userChangePasswordDTO: UserChangePasswordDTO): Promise<MessageDTO> {
    return this.userService.changeUserPassword(userChangePasswordDTO);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserDTO,
    description: 'Admin creates a new user',
  })
  @Permissions({ resource: 'user', action: 'create' })
  createUser(@Body() createUserDTO: CreateUserDTO): Promise<UserDTO> {
    return this.userService.createUser(createUserDTO);
  }

  @Get('pending-admins')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [UserDTO],
    description: 'List of users with ADMIN role pending approval',
  })
  @Permissions({ resource: 'admin-approval', action: 'list' })
  getPendingAdmins(): Promise<UserDTO[]> {
    return this.userService.getPendingAdmins();
  }

  @Patch(':id/status')
  @ApiResponse({
    status: HttpStatus.OK,
    type: MessageDTO,
    description: 'Update user status (APPROVED/REJECTED)',
  })
  @Permissions({ resource: 'admin-approval', action: 'update' })
  updateStatus(@Param('id') id: string, @Body('status') status: UserStatus): Promise<MessageDTO> {
    return this.userService.updateUserStatus(parseInt(id, 10), status);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: MessageDTO,
    description: 'Deletes a user',
  })
  @Permissions({ resource: 'user', action: 'delete' })
  deleteUser(@Param('id') id: string): Promise<MessageDTO> {
    return this.userService.deleteUser(parseInt(id, 10));
  }
}
