import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { BaseRepository } from '@common/base.repository';
import { AuthEntity } from '@modules/api/auth/auth.entity';

@Injectable()
export class AuthRepository extends BaseRepository<AuthEntity> {
  protected tableName = 'authenticates';
  protected primaryKey = 'auth_id';
  protected logger = new Logger(AuthRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }
}
