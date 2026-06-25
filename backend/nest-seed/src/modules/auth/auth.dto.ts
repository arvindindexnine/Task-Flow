import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class AccessTokenDTO {
  @ApiResponseProperty()
  accessToken: string;
}

export class RefreshTokenDTO {
  @ApiProperty()
  refreshToken: string;
}

export class TokenDetailsDTO {
  @ApiResponseProperty()
  token: string;

  @ApiResponseProperty()
  grantType: string;

  @ApiResponseProperty()
  expiresIn: string;
}

export class TokenDTO {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    status: string;
  };
}

export class AuthChangePasswordDTO {
  @ApiProperty()
  currentPassword: string;

  @ApiProperty()
  newPassword: string;
}
