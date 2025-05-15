import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '@modules/api/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthRepository } from './auth.repository';
import { MailModule } from '@modules/mail/mail.module';
import { PasswordResetRepository } from '@modules/api/auth/password-reset.repository';
import { PasswordResetService } from '@modules/api/auth/password-reset.service';
import { RefreshTokenRepository } from '@modules/api/auth/refresh-token.repository';
import { RefreshTokenService } from '@modules/api/auth/refresh-token.service';
import { TokenService } from '@modules/api/auth/token.service';
import { AllConfigType } from '@config/config.type';

@Module({
  imports: [
    UserModule,
    PassportModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AllConfigType>) => {
        const authConfig = configService.getOrThrow('auth', { infer: true });
        return {
          secret: authConfig.accessTokenSecret,
          signOptions: {
            expiresIn: authConfig.accessTokenExpiresIn,
          },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    AuthRepository,
    RefreshTokenService,
    RefreshTokenRepository,
    PasswordResetService,
    PasswordResetRepository,
    TokenService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, AuthService, AuthRepository],
})
export class AuthModule {}
