import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AuthConfig implements JwtOptionsFactory {
  Options: {
    jwtOptions: any;
    accessTokenOptions: any;
    refreshTokenOptions: any;
    grantTypes: any;
    superAdmin: any;
  };

  constructor(private configService: ConfigService) {
    this.Options = {
      jwtOptions: {
        secret: this.configService.get('jwt.secret'),
        signOptions: {
          expiresIn: this.configService.get('jwt.accessTokenOptions.expiresIn'),
          jti: uuidv4(),
        },
      },
      accessTokenOptions: this.configService.get('jwt.accessTokenOptions'),
      refreshTokenOptions: this.configService.get('jwt.refreshTokenOptions'),
      grantTypes: this.configService.get('jwt.grantTypes'),
      superAdmin: this.configService.get('superAdmin'),
    };
  }

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    return {
      secret: this.configService.get('jwt.secret'),
      signOptions: {
        expiresIn: this.configService.get('jwt.accessTokenOptions.expiresIn'),
      },
    };
  }
}
