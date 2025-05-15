import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { ProductVariantEntity } from '@modules/api/product/entities/product-variant.entity';
import { DatabaseService } from '@modules/database/database.service';

@Injectable()
export class ProductVariantRepository extends BaseRepository<ProductVariantEntity> {
  protected tableName = 'product_variants';
  protected primaryKey = 'variant_id';
  protected logger = new Logger(ProductVariantRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }
}
