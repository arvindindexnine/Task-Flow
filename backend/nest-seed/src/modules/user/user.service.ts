import { HttpStatus, Injectable } from '@nestjs/common';
import { logger, SeedException } from '@snap/core';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ClsService } from 'nestjs-cls';
import { RequestContext } from '../../../libs/snap/src/request-context/request-context.dto';
import { MessageDTO } from '../../dto/message.dto';
import { getStartIndex, PaginationDto } from '../../dto/pager.dto';
import { BcryptConstants } from '../auth/auth.constants';
import { Role } from '../role/role.entity';
import { RoleService } from '../role/role.service';
import { CreateUserDTO, ForgotPasswordResponseDTO, ResetPasswordDTO, UserChangePasswordDTO, UserDTO, UserResponseDTO } from './user.dto';
import { User, UserStatus } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly cls: ClsService,
  ) {}

  async createUser(createUserDto: CreateUserDTO): Promise<UserDTO> {
    const { email, name, roles, password } = createUserDto;
    logger.debug(`[UserService] Creating user: ${email}, Roles: ${JSON.stringify(roles)}`);

    if (await this.userRepository.findUserByEmail(email)) {
      throw new SeedException('email already in use', HttpStatus.CONFLICT);
    }

    const roleEntities: Role[] = await this.roleService.findByNames(roles);
    logger.debug(`[UserService] Found role entities: ${JSON.stringify(roleEntities.map((r) => r.name))}`);

    if (roleEntities.length !== roles.length) {
      throw new SeedException('Contains Invalid Role', HttpStatus.PRECONDITION_FAILED);
    }
    let user: User = new User();
    user.email = email;
    user.name = name;
    user.roles = Promise.resolve(roleEntities);
    user.password = await bcrypt.hash(password, BcryptConstants.saltRounds);

    // If roles include 'ADMIN', set status to PENDING
    // Use string literal to be safe if enum mismatch exists
    if (roles.includes('ADMIN')) {
      logger.debug(`[UserService] User is ADMIN, setting status to PENDING`);
      user.status = UserStatus.PENDING;
    } else {
      logger.debug(`[UserService] User is not ADMIN, setting status to APPROVED`);
      user.status = UserStatus.APPROVED;
    }

    user = await this.userRepository.addUser(user);
    const { id, status } = user;
    const primaryRole = roles[0] || 'MEMBER';

    return { id, name, email, status, role: primaryRole } as any;
  }

  async getUser(): Promise<UserDTO[]> {
    const requestContext = this.cls.get<RequestContext>('requestContext');
    const { userId, email, name, roles } = requestContext;

    if (userId === 0) {
      return [
        {
          id: 0,
          name: name || 'Super Admin',
          email,
          status: UserStatus.APPROVED,
          roles: roles.map((r) => ({ id: 0, name: r })),
        } as UserDTO,
      ];
    }

    const users: any[] = await this.userRepository.findUserDetailsWithRole(userId);
    const userDtos: UserDTO[] = [];

    if (users.length === 0) {
      throw new SeedException('No Record Found', HttpStatus.NOT_FOUND);
    }
    for (const user of users) {
      userDtos.push(user);
    }
    return userDtos;
  }

  list(paginationDto: PaginationDto): Promise<UserResponseDTO> {
    const startIndex = getStartIndex(paginationDto.page, paginationDto.limit);
    return this.userRepository.getAllUsers(paginationDto, startIndex);
  }

  findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findUserByEmail(email);
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponseDTO> {
    const user: User = await this.findUserByEmail(email);
    if (!user) {
      throw new SeedException('Email not registered!', HttpStatus.NOT_FOUND);
    }

    // Generate a 6-digit code
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const hashedToken = crypto.createHash('sha256').update(resetCode).digest('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.userRepository.saveResetToken(email, hashedToken, expiry);

    // LOG TO TERMINAL AS REQUESTED
    // eslint-disable-next-line no-console
    console.log('\n==========================================');
    // eslint-disable-next-line no-console
    console.log(`PASSWORD RESET CODE FOR ${email}: ${resetCode}`);
    // eslint-disable-next-line no-console
    console.log('==========================================\n');
    logger.info(`PASSWORD RESET CODE FOR ${email}: ${resetCode}`);

    const response = new ForgotPasswordResponseDTO();
    response.resetToken = resetCode;
    response.expiresAt = expiry;
    return response;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDTO): Promise<MessageDTO> {
    const { resetToken, newPassword } = resetPasswordDto;
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await this.userRepository.findUserByResetToken(hashedToken);

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new SeedException('Reset token is invalid or has expired', HttpStatus.BAD_REQUEST);
    }

    const updatedPassword = await bcrypt.hash(newPassword, BcryptConstants.saltRounds);
    await this.userRepository.changeUserPassword(user.email, updatedPassword);
    await this.userRepository.clearResetToken(user.email);

    logger.info(`Password reset successfully for user: ${user.email}`);

    return new MessageDTO('Password reset successfully');
  }

  async changeUserPassword(userChangePwdDto: UserChangePasswordDTO): Promise<MessageDTO> {
    const { email, oldPassword, newPassword } = userChangePwdDto;
    const user: User = await this.findUserByEmail(email);
    if (!user) {
      throw new SeedException('No User Found', HttpStatus.NOT_FOUND);
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new SeedException('Incorrect password', HttpStatus.PRECONDITION_FAILED);
    }

    const updatedPassword = await bcrypt.hash(newPassword, BcryptConstants.saltRounds);
    await this.userRepository.changeUserPassword(email, updatedPassword);

    logger.info(`Password updated successfully for user: ${email}`);

    return new MessageDTO('Password Changed Successfully');
  }

  async getPendingAdmins(): Promise<UserDTO[]> {
    const users = await this.userRepository.findPendingAdmins();
    return Promise.all(
      users.map(async (user) => {
        const roleEntities = await user.roles;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
          roles: roleEntities.map((role) => ({ id: role.id, name: role.name })),
        } as UserDTO;
      }),
    );
  }

  async updateUserStatus(userId: number, status: UserStatus): Promise<MessageDTO> {
    await this.userRepository.updateUserStatus(userId, status);
    return new MessageDTO(`User status updated to ${status}`);
  }

  async verifyResetCode(resetToken: string): Promise<MessageDTO> {
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await this.userRepository.findUserByResetToken(hashedToken);

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new SeedException('Invalid or expired verification code', HttpStatus.BAD_REQUEST);
    }

    return new MessageDTO('Code verified');
  }

  async deleteUser(userIdToDelete: number): Promise<MessageDTO> {
    const requestContext = this.cls.get<RequestContext>('requestContext');
    const { roles: currentUserRoles } = requestContext;

    const userToDelete = await this.userRepository.findUserById(userIdToDelete);
    if (!userToDelete) {
      throw new SeedException('User not found', HttpStatus.NOT_FOUND);
    }

    const rolesToDelete = (await userToDelete.roles).map((r) => r.name);

    // Super Admins are permanent (cannot be deleted)
    if (rolesToDelete.includes('SUPER_ADMIN')) {
      throw new SeedException('Super Admins cannot be deleted', HttpStatus.FORBIDDEN);
    }

    // Admins can only delete Members, not other Admins or Super Admins (Super Admin check already done)
    if (currentUserRoles.includes('ADMIN') && !currentUserRoles.includes('SUPER_ADMIN')) {
      if (rolesToDelete.includes('ADMIN')) {
        throw new SeedException('Admins cannot delete other Admins', HttpStatus.FORBIDDEN);
      }
    }

    await this.userRepository.deleteUser(userIdToDelete);
    logger.info(`User deleted: ${userToDelete.email} by Admin/SuperAdmin`);
    return new MessageDTO('User deleted successfully');
  }
}
