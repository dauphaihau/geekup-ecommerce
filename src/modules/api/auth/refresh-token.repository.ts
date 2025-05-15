import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { BaseRepository } from '@common/base.repository';
import { UserEntity } from '@modules/api/user/user.entity';
import { RefreshTokenEntity } from '@modules/api/auth/refresh-token.entity';

interface CreateRefreshTokenDto {
  user_id: UserEntity['user_id'];
  token_hash: string;
  expires_at: Date;
}

@Injectable()
export class RefreshTokenRepository extends BaseRepository<any> {
  protected tableName = 'refresh_tokens';
  protected primaryKey = 'token_id';
  protected logger = new Logger(RefreshTokenRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }

  async create(dto: CreateRefreshTokenDto) {
    return await this.dbService.executeQuerySingle<{ token: string }>(
      'create refresh token',
      `
          INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
          VALUES ($1, $2, $3)
          RETURNING *
      `,
      [dto.user_id, dto.token_hash, dto.expires_at],
    );
  }

  async updateByUserId(
    userId: UserEntity['user_id'],
    data: Partial<RefreshTokenEntity>,
  ) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');

    return await this.dbService.executeNonQuery(
      'update auth by user id',
      `
        UPDATE refresh_tokens
        SET ${setClause}
        WHERE user_id = $${columns.length + 1}
      `,
      [...values, userId],
    );
  }
}
