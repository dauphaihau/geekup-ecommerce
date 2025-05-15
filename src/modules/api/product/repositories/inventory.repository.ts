import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { DatabaseService } from '@modules/database/database.service';
import { InventoryEntity } from '@modules/api/product/entities/inventory.entity';

@Injectable()
export class InventoryRepository extends BaseRepository<InventoryEntity> {
  protected tableName = 'inventories';
  protected primaryKey = 'inventory_id';
  protected logger = new Logger(InventoryRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }
}
