import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { BaseRepository } from '@common/base.repository';
import { PasswordResetTokenEntity } from '@modules/api/auth/password-reset-token.entity';

@Injectable()
export class PasswordResetRepository extends BaseRepository<PasswordResetTokenEntity> {
  protected tableName = 'password_reset_tokens';
  protected primaryKey = 'token_id';
  protected logger = new Logger(PasswordResetRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }
}
