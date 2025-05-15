import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { BaseRepository } from '@common/base.repository';
import { CategoryEntity } from '@modules/api/category/category.entity';

@Injectable()
export class CategoryRepository extends BaseRepository<CategoryEntity> {
  protected tableName = 'categories';
  protected primaryKey = 'category_id';
  protected logger = new Logger(CategoryRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }
}
