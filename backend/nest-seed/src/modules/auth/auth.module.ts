import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthConfig } from './auth-config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-strategy';

@Global()
@Module({
  providers: [AuthService, JwtStrategy, AuthConfig],
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: AuthConfig,
    }),
  ],
  exports: [AuthService, AuthConfig],
})
export class AuthModule {}
