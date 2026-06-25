import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '../role/role.module';
import { UserCommandHandlers } from './commands';
import { UserQueryHandlers } from './queries';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  providers: [UserService, UserRepository, ...UserCommandHandlers, ...UserQueryHandlers],
  imports: [TypeOrmModule.forFeature([User]), RoleModule],
  exports: [UserService],
})
export class UserModule {}
