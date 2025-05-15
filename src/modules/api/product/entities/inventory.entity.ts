import { BaseEntity } from '@common/base.entity';

export class InventoryEntity extends BaseEntity {
  inventory_id: string;
  store_id: string;
  variant_id: string;
  stock_quantity: number;
  last_stock_update: Date;
}
