import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@modules/api/user/user.service';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { CookieOptions } from 'express';
import { Environment } from '@app/constants/app.constant';
import PostgresErrorCode from '../../database/postgres-error-code.enum';
import UserAlreadyExistsException from '@modules/api/user/exceptions/user-already-exists.exception';
import { AllConfigType } from '@config/config.type';
import { Transactional } from '@nestjs-cls/transactional';
import { UserEntity } from '@modules/api/user/user.entity';
import { FullUserResponseDto } from '@modules/api/user/dto/full-user-response.dto';
import {
  CreateAuthDto,
  CreateAuthResponseDto,
} from '@modules/api/auth/dto/create-auth.dto';
import { AuthEntity } from '@modules/api/auth/auth.entity';
import { RefreshTokenService } from '@modules/api/auth/refresh-token.service';
import { TokenService } from '@modules/api/auth/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authRepo: AuthRepository,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly tokenService: TokenService,
  ) {}

  public async logIn(userId: UserEntity['user_id']) {
    const tokens = await this.generateNewTokens(userId);
    await this.refreshTokenService.create({
      userId,
      refreshToken: tokens.refreshToken,
    });
    return tokens;
  }

  @Transactional()
  public async register(
    registrationData: RegisterDto,
  ): Promise<{ user: FullUserResponseDto }> {
    try {
      const hashedPassword = await this.hashPassword(registrationData.password);

      const newUser = await this.userService.create({
        first_name: registrationData.first_name,
        last_name: registrationData.last_name,
        username: registrationData.username,
      });
      const newAuth = await this.create({
        user_id: newUser.user_id,
        email: registrationData.email,
        password_hash: hashedPassword,
        phone_number: registrationData.phone_number,
      });
      return {
        user: new FullUserResponseDto({
          ...newUser,
          ...newAuth,
        }),
      };
    } catch (error) {
      if (error.code === PostgresErrorCode.UniqueViolation) {
        // throw new UserAlreadyExistsException(registrationData.email);
        const detail = error.detail as string;

        if (detail.includes('(email)')) {
          throw new UserAlreadyExistsException(
            `${registrationData.email} email`,
          );
        }
        if (detail.includes('(phone_number)')) {
          throw new UserAlreadyExistsException(
            `${registrationData.phone_number} phone number`,
          );
        }
        throw new ConflictException('Unique constraint violation');
      }
      throw error;
    }
  }

  public async getAuthenticatedUser(
    identifier: string,
    plainTextPassword: string,
  ): Promise<FullUserResponseDto> {
    try {
      const user = await this.userService.getFullUserByIdentifier(identifier);
      await this.verifyPassword(plainTextPassword, user.password_hash);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Wrong credentials provided', {
        cause: error,
      });
    }
  }

  @Transactional()
  public async refreshAccessToken(refreshToken: string) {
    const refreshTokenHash = this.tokenService.hashToken(refreshToken);

    const refreshTokenRecord =
      await this.refreshTokenService.findByTokenHash(refreshTokenHash);

    // check existence of refresh token
    if (!refreshTokenRecord) {
      throw new UnauthorizedException('Refresh token not found');
    }

    // check is revoked
    if (refreshTokenRecord.revoked) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    // check if the refresh token has expired
    const now = new Date();
    if (refreshTokenRecord.expires_at < now) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // generate new tokens
    const tokens = await this.generateNewTokens(refreshTokenRecord.user_id);

    // rotate refresh token
    await this.refreshTokenService.updateById(refreshTokenRecord.token_id, {
      revoked: true,
    });

    await this.refreshTokenService.create({
      userId: refreshTokenRecord.user_id,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async create(authDto: CreateAuthDto): Promise<CreateAuthResponseDto> {
    const entity = await this.authRepo.create(authDto);
    return new CreateAuthResponseDto(entity);
  }

  async getByEmail(email: string): Promise<AuthEntity> {
    return this.authRepo.findOne('email = $1', [email]);
  }

  async updateByUserId(
    userId: UserEntity['user_id'],
    data: Partial<AuthEntity>,
  ) {
    return this.authRepo.updateWhere(`user_id = '${userId}'`, data);
  }

  public getTokenCookieConfigs() {
    const appConfig = this.configService.getOrThrow('app', { infer: true });
    const authConfig = this.configService.getOrThrow('auth', { infer: true });

    const accessTokenCookieOptions: CookieOptions = {
      httpOnly: true,
      secure: appConfig.nodeEnv === Environment.Production, // use HTTPS in production
      sameSite: 'strict',
      maxAge: authConfig.accessTokenExpiresIn,
    };
    const refreshTokenCookieOptions: CookieOptions = {
      httpOnly: true,
      secure: appConfig.nodeEnv === Environment.Production, // use HTTPS in production
      sameSite: 'strict',
      maxAge: authConfig.refreshTokenExpiresIn,
      path: '/api/v1/auth/refresh', // Optional: restrict path where cookie is sent
    };
    return {
      accessTokenCookieOptions,
      refreshTokenCookieOptions,
    };
  }

  private async generateNewTokens(userId: UserEntity['user_id']) {
    const accessToken = await this.generateAccessToken({ userId });
    return {
      accessToken,
      refreshToken: this.tokenService.generateToken(),
    };
  }

  private async generateAccessToken(payload: {
    userId: UserEntity['user_id'];
  }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hashSync(password, 10);
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashPassword: string,
  ) {
    const isMatch = await bcrypt.compare(plainTextPassword, hashPassword);
    if (!isMatch) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
