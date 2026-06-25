import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestContextMiddleware, RequestLogger, SnapModule } from '@snap/core';
import { ClsMiddleware } from 'nestjs-cls';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { ControllersModule } from './controllers/controllers.module';
import { RoleController } from './controllers/role.controller';
import { TaskController } from './controllers/task.controller';
import { UserController } from './controllers/user.controller';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    SnapModule,
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    UserModule,
    RoleModule,
    AuthModule,
    TaskModule,
    ControllersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClsMiddleware, RequestContextMiddleware, RequestLogger)
      .forRoutes(AuthController, RoleController, UserController, TaskController, AppController);
  }
}
