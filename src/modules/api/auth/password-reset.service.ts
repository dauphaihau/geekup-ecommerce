import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PasswordResetRepository } from '@modules/api/auth/password-reset.repository';
import { addMilliseconds } from 'date-fns';
import { MailService } from '@modules/mail/mail.service';
import { UpdatePasswordDto } from '@modules/api/auth/dto/update-password.dto';
import { Transactional } from '@nestjs-cls/transactional';
import { AuthConfig } from '@modules/api/auth/config/auth-config.type';
import ms from 'ms';
import { AuthService } from '@modules/api/auth/auth.service';
import { TokenService } from '@modules/api/auth/token.service';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly configService: ConfigService,
    private readonly passwordResetTokenRepo: PasswordResetRepository,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  public async sendResetToken(email: string): Promise<void> {
    const auth = await this.authService.getByEmail(email);
    if (!auth) {
      // Don't reveal if the email doesn't exist for security reasons
      console.log(`Password reset requested for non-existent email: ${email}`);
      return;
    }

    const token = this.tokenService.generateToken();
    const tokenHash = this.tokenService.hashToken(token);

    const authConfig = this.configService.get<AuthConfig>('auth');
    const resetTokenExpiresInMs = ms(authConfig.resetTokenExpires);
    const expiresAt = addMilliseconds(new Date(), resetTokenExpiresInMs);

    await this.passwordResetTokenRepo.create({
      user_id: auth.user_id,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    await this.mailService.sendResetPassword({
      to: email,
      data: {
        token,
      },
    });
  }

  async verifyResetToken(token: string) {
    const tokenHash = this.tokenService.hashToken(token);
    const resetTokenRecord = await this.passwordResetTokenRepo.findOne(
      `token_hash = $1`,
      [tokenHash],
    );
    const now = new Date();

    if (
      !resetTokenRecord ||
      resetTokenRecord.expires_at < now ||
      resetTokenRecord.revoked
    ) {
      throw new BadRequestException('Invalid or expired reset token.');
    }
    return resetTokenRecord;
  }

  @Transactional()
  async updatePassword(dto: UpdatePasswordDto): Promise<void> {
    const resetToken = await this.verifyResetToken(dto.token);
    const passwordHash = await this.authService.hashPassword(dto.password);

    await this.authService.updateByUserId(resetToken.user_id, {
      password_hash: passwordHash,
    });

    await this.passwordResetTokenRepo.delete(resetToken.token_id);
  }
}
