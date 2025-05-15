import { Injectable } from '@nestjs/common';
import { UserEntity } from '@modules/api/user/user.entity';
import { RefreshTokenRepository } from '@modules/api/auth/refresh-token.repository';
import { addMilliseconds } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@config/config.type';
import { AuthConfig } from '@modules/api/auth/config/auth-config.type';
import { TokenService } from '@modules/api/auth/token.service';
import { RefreshTokenEntity } from '@modules/api/auth/refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  public async revokeRefreshToken(
    userId: UserEntity['user_id'],
  ): Promise<void> {
    await this.refreshTokenRepo.updateWhere(`user_id = '${userId}'`, {
      revoked: true,
    });
  }

  async create(dto: { userId: UserEntity['user_id']; refreshToken: string }) {
    const refreshTokenHash = this.tokenService.hashToken(dto.refreshToken);
    const authConfig = this.configService.get<AuthConfig>('auth');
    const expiresAt = addMilliseconds(
      new Date(),
      authConfig.refreshTokenExpiresIn,
    );

    await this.refreshTokenRepo.create({
      user_id: dto.userId,
      token_hash: refreshTokenHash,
      expires_at: expiresAt,
    });
  }

  async findByTokenHash(tokenHash: string) {
    return this.refreshTokenRepo.findOne('token_hash = $1', [tokenHash]);
  }

  async updateById(id: string, data: Partial<RefreshTokenEntity>) {
    return this.refreshTokenRepo.update(id, data);
  }
}
