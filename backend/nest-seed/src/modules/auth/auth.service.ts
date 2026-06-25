import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { logger } from '@snap/core';
import * as bcrypt from 'bcrypt';
import { CreateUserCommand } from '../user/commands/create-user-command';
import { GetUserByEmailQuery } from '../user/queries/get-user-by-email.query';
import { CreateUserDTO, CredentialsDTO } from '../user/user.dto';
import { UserRoles } from '../../constants/enum';
import { User, UserStatus } from '../user/user.entity';
import { AuthConfig } from './auth-config';
import { AccessTokenDTO, TokenDTO, TokenDetailsDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authConfig: AuthConfig,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user: User = await this.queryBus.execute(new GetUserByEmailQuery(email));
    logger.debug(`User: ${JSON.stringify(user)}`);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async generateAccessToken(user: User | { id: number; name: string; email: string; roles: string[] }): Promise<TokenDetailsDTO> {
    const { accessGrant } = this.authConfig.Options.grantTypes;
    const accessTokenExpiresIn = this.authConfig.Options.accessTokenOptions.expiresIn;
    const { jti } = this.authConfig.Options.jwtOptions.signOptions;

    const roles = 'roles' in user && Array.isArray(user.roles) ? user.roles : (await (user as User).roles).map((role) => role.name);

    const accessTokenPayload = {
      name: user.name,
      email: user.email,
      userId: user.id,
      roles,
      grantType: accessGrant,
      jti,
    };

    const tokenDetailsDto: TokenDetailsDTO = new TokenDetailsDTO();

    tokenDetailsDto.token = this.jwtService.sign(accessTokenPayload);
    tokenDetailsDto.grantType = accessGrant;
    tokenDetailsDto.expiresIn = accessTokenExpiresIn;
    return tokenDetailsDto;
  }

  generateRefreshToken(user: User | { id: number; email: string }): TokenDetailsDTO {
    const { refreshGrant } = this.authConfig.Options.grantTypes;
    const refreshTokenExpiresIn: string = this.authConfig.Options.refreshTokenOptions.expiresIn;

    const refreshPayload = {
      email: user.email,
      userId: user.id,
      grantType: refreshGrant,
    };

    const tokenDetailsDto: TokenDetailsDTO = new TokenDetailsDTO();

    tokenDetailsDto.token = this.jwtService.sign(refreshPayload);
    tokenDetailsDto.grantType = refreshGrant;
    tokenDetailsDto.expiresIn = refreshTokenExpiresIn;
    return tokenDetailsDto;
  }

  async login(credentialsDTO: CredentialsDTO): Promise<TokenDTO> {
    const { email, password, isAdmin } = credentialsDTO;

    // Super Admin is now handled via database like any other user

    const user: User = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Role-based login restriction
    const roleEntities = await user.roles;
    const roles = roleEntities.map((r) => r.name);

    if (isAdmin && !roles.includes(UserRoles.ADMIN) && !roles.includes(UserRoles.SUPER_ADMIN)) {
      throw new UnauthorizedException('Only administrators can login here');
    }

    if (!isAdmin && (roles.includes(UserRoles.ADMIN) || roles.includes(UserRoles.SUPER_ADMIN))) {
      throw new UnauthorizedException('Administrators must use the admin portal');
    }

    // Check if user is approved
    if (user.status !== UserStatus.APPROVED) {
      throw new UnauthorizedException(`Your account is ${user.status.toLowerCase()}. Please contact administrator.`);
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    const primaryRole = roles[0] || 'MEMBER';

    return {
      token: accessToken.token,
      refreshToken: refreshToken.token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: primaryRole,
        status: user.status,
      },
    };
  }

  async signUp(createUserDto: CreateUserDTO): Promise<any> {
    const user = await this.commandBus.execute(new CreateUserCommand(createUserDto));
    return { user, token: null };
  }

  async refreshToken(token: string): Promise<AccessTokenDTO> {
    const refreshTokenPayload = this.jwtService.verify(token);
    const userFromDb: User = await this.queryBus.execute(new GetUserByEmailQuery(refreshTokenPayload.email));

    if (refreshTokenPayload.grantType !== 'refresh' || !userFromDb) {
      throw new UnauthorizedException();
    }

    const accessTokenDto: AccessTokenDTO = new AccessTokenDTO();
    accessTokenDto.accessToken = (await this.generateAccessToken(userFromDb)).token;
    return accessTokenDto;
  }
}
