import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pager, PaginationDto } from '../../dto/pager.dto';
import { Role } from '../role/role.entity';
import { Task } from '../task/task.entity';
import { UserDTO, UserResponseDTO } from './user.dto';
import { User, UserStatus } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({
      email,
    });
  }

  findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  findPendingAdmins(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.status = :status', { status: UserStatus.PENDING })
      .getMany();
  }

  async updateUserStatus(userId: number, status: UserStatus): Promise<void> {
    await this.userRepository.update(userId, { status });
  }

  async getAllUsers(pagination: PaginationDto, startIndex: number): Promise<UserResponseDTO> {
    const rawUsers = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'role')
      .leftJoin('user.tasks', 'task')
      .select([
        'user.id as id',
        'user.email as email',
        'user.name as name',
        'user.status as status',
        'role.name as role',
        'COUNT(task.id) as "taskCount"',
      ])
      .groupBy('user.id')
      .addGroupBy('role.id')
      .orderBy('user.id', 'ASC')
      .limit(pagination.limit)
      .offset(startIndex)
      .getRawMany();

    const usersDTORes: UserDTO[] = rawUsers.map(
      (raw) =>
        ({
          id: raw.id,
          name: raw.name,
          email: raw.email,
          status: raw.status,
          role: raw.role,
          taskCount: parseInt(raw.taskCount, 10),
        }) as any,
    );

    const [totalUsers, totalTasks, activeMembersCount] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.manager.getRepository(Task).count(),
      this.userRepository.createQueryBuilder('user').leftJoin('user.roles', 'role').where('role.name = :role', { role: 'MEMBER' }).getCount(),
    ]);

    const pager = new Pager(totalUsers, Number(pagination.page), Number(pagination.limit), startIndex);
    const userResWithPagination: UserResponseDTO = new UserResponseDTO();
    userResWithPagination.users = usersDTORes;
    userResWithPagination.pager = pager;
    userResWithPagination.totalUsers = totalUsers;
    userResWithPagination.totalTasks = totalTasks;
    userResWithPagination.activeMembers = activeMembersCount;

    return userResWithPagination;
  }

  changeUserPassword(userEmail: string, newPassword: string) {
    return this.userRepository.update({ email: userEmail }, { password: newPassword });
  }

  findUserDetailsWithRole(userId: number) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user_role', 'ur', 'ur.user_id = user.id')
      .leftJoinAndSelect(Role, 'role', 'ur.role_id = role.id')
      .where('user.id=:userId', { userId })
      .select(['user.email', 'user.name', 'role.name'])
      .getRawMany();
  }

  findUserByResetToken(hashedToken: string): Promise<User> {
    return this.userRepository.findOneBy({ resetToken: hashedToken });
  }

  saveResetToken(email: string, hashedToken: string, expiry: Date) {
    return this.userRepository.update({ email }, { resetToken: hashedToken, resetTokenExpiry: expiry });
  }

  clearResetToken(email: string) {
    return this.userRepository.update({ email }, { resetToken: null, resetTokenExpiry: null });
  }

  async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }

  addUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
