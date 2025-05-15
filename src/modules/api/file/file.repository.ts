import { BaseRepository } from '@common/base.repository';
import { Injectable, Logger } from '@nestjs/common';
import { FileEntity } from '@modules/api/file/file.entity';
import { DatabaseService } from '@modules/database/database.service';

@Injectable()
export class FileRepository extends BaseRepository<FileEntity> {
  protected tableName = 'files';
  protected primaryKey = 'file_id';
  protected logger = new Logger(FileRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }
}
