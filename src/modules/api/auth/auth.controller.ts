import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthenticationGuard } from '../../../guards/local-authentication.guard';
import { Response } from 'express';
import JwtAuthenticationGuard from '../../../guards/jwt-authentication.guard';
import { UserEntity } from '@modules/api/user/user.entity';
import { CurrentUser } from '@app/decorators/current-user.decorator';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { PasswordResetService } from '@modules/api/auth/password-reset.service';
import { VerifyTokenDto } from '@modules/api/auth/dto/verify-token.dto';
import { UpdatePasswordDto } from '@modules/api/auth/dto/update-password.dto';
import { RefreshTokenService } from '@modules/api/auth/refresh-token.service';
import { LoginDto } from '@modules/api/auth/dto/login.dto';
import { RefreshTokenFromCookie } from '@modules/api/auth/decorators/refresh-token-from-cookie.decorator';
import { seconds, Throttle } from '@nestjs/throttler';
import { FullUserResponseDto } from '@modules/api/user/dto/full-user-response.dto';

@Throttle({ default: { limit: 5, ttl: seconds(30) } })
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordResetService: PasswordResetService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'User successfully created.' })
  @ApiConflictResponse({ description: 'User already exists.' })
  async register(@Body() registrationData: RegisterDto) {
    return await this.authService.register(registrationData);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthenticationGuard)
  @ApiOperation({
    description: 'you can use email, phone or username as identifier',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'User successfully logged in.' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  async logIn(
    @CurrentUser() currentUser: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserEntity> {
    const tokens = await this.authService.logIn(currentUser.user_id);
    const cookieConfigs = this.authService.getTokenCookieConfigs();

    res.cookie(
      'accessToken',
      tokens.accessToken,
      cookieConfigs.accessTokenCookieOptions,
    );
    res.cookie(
      'refreshToken',
      tokens.refreshToken,
      cookieConfigs.refreshTokenCookieOptions,
    );
    return currentUser;
  }

  @Post('password-reset')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: 'Password reset request sent.' })
  async resetPasswordRequest(
    @Body() dto: ResetPasswordRequestDto,
  ): Promise<void> {
    await this.passwordResetService.sendResetToken(dto.email);
  }

  @Get('password-reset')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Reset token successfully verified.' })
  @ApiBadRequestResponse({ description: 'Invalid or expired reset token.' })
  async verifyToken(@Query() dto: VerifyTokenDto): Promise<void> {
    await this.passwordResetService.verifyResetToken(dto.token);
  }

  @Put('password-reset')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Password successfully updated.' })
  @ApiBadRequestResponse({ description: 'Invalid or expired reset token.' })
  async resetPassword(@Body() dto: UpdatePasswordDto): Promise<void> {
    await this.passwordResetService.updatePassword(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Access & refresh token successfully refreshed.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token.' })
  async refresh(
    @RefreshTokenFromCookie() refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshAccessToken(refreshToken);
    const cookieConfigs = this.authService.getTokenCookieConfigs();

    res.cookie(
      'accessToken',
      tokens.accessToken,
      cookieConfigs.accessTokenCookieOptions,
    );
    res.cookie(
      'refreshToken',
      tokens.refreshToken,
      cookieConfigs.refreshTokenCookieOptions,
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthenticationGuard)
  @ApiOkResponse({ description: 'User successfully logged out.' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  async logOut(
    @CurrentUser() currentUser: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.refreshTokenService.revokeRefreshToken(currentUser.user_id);
    const cookieConfigs = this.authService.getTokenCookieConfigs();
    delete cookieConfigs.accessTokenCookieOptions.maxAge;
    delete cookieConfigs.refreshTokenCookieOptions.maxAge;
    res.clearCookie('accessToken', cookieConfigs.accessTokenCookieOptions);
    res.clearCookie('refreshToken', cookieConfigs.refreshTokenCookieOptions);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({
    description: 'Verify access token and return authenticated user.',
  })
  @ApiOkResponse({ description: 'User successfully logged in.' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  authenticate(
    @CurrentUser() currentUser: FullUserResponseDto,
  ): FullUserResponseDto {
    return currentUser;
  }
}
