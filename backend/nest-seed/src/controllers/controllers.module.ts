import { Module } from '@nestjs/common';

import { AuthModule } from '../modules/auth/auth.module';
import { RoleModule } from '../modules/role/role.module';
import { TaskModule } from '../modules/task/task.module';
import { UserModule } from '../modules/user/user.module';
import { AuthController } from './auth.controller';
import { RoleController } from './role.controller';
import { TaskController } from './task.controller';
import { UserController } from './user.controller';

@Module({
  imports: [UserModule, RoleModule, AuthModule, TaskModule],
  controllers: [AuthController, UserController, RoleController, TaskController],
})
export class ControllersModule {}
