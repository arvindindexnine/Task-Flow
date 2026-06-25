import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { MessageDTO } from '../dto/message.dto';
import { AccessTokenDTO, AuthChangePasswordDTO, RefreshTokenDTO, TokenDTO } from '../modules/auth/auth.dto';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';
import { AuthService } from '../modules/auth/auth.service';
import { CreateUserDTO, CredentialsDTO, ForgotPasswordResponseDTO, ResetPasswordDTO, UserDTO } from '../modules/user/user.dto';
import { UserService } from '../modules/user/user.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: TokenDTO,
    description: 'TokenDTO with token and user details',
  })
  login(@Body() credentialsDTO: CredentialsDTO): Promise<TokenDTO> {
    return this.authService.login(credentialsDTO);
  }

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserDTO,
    description: 'UserDTO with user details',
  })
  signUp(@Body() createUserDTO: CreateUserDTO): Promise<UserDTO> {
    return this.authService.signUp(createUserDTO);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: AccessTokenDTO,
    description: 'AccessTokenDTO with token details',
  })
  refreshToken(@Body() refreshTokenDTO: RefreshTokenDTO): Promise<AccessTokenDTO> {
    const { refreshToken } = refreshTokenDTO;
    return this.authService.refreshToken(refreshToken);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ForgotPasswordResponseDTO,
    description: 'Returns a reset token valid for 1 hour',
  })
  forgotPassword(@Body() body: { email: string }): Promise<ForgotPasswordResponseDTO> {
    return this.userService.forgotPassword(body.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: MessageDTO,
    description: 'Resets password using the token from forgot-password',
  })
  resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO): Promise<MessageDTO> {
    return this.userService.resetPassword(resetPasswordDTO);
  }

  @Post('verify-reset-code')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: MessageDTO,
    description: 'Verifies the 6-digit reset code',
  })
  verifyResetCode(@Body() body: { resetToken: string }): Promise<MessageDTO> {
    return this.userService.verifyResetCode(body.resetToken);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: MessageDTO,
    description: 'Changes the user password',
  })
  changePassword(@Req() req: any, @Body() authChangePasswordDTO: AuthChangePasswordDTO): Promise<MessageDTO> {
    const { email } = req.user;
    return this.userService.changeUserPassword({
      email,
      oldPassword: authChangePasswordDTO.currentPassword,
      newPassword: authChangePasswordDTO.newPassword,
    });
  }
}
