import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { DatabaseService } from '@modules/database/database.service';

export interface OrderItem {
  order_item_id: string;
  order_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class OrderItemRepository extends BaseRepository<OrderItem> {
  protected tableName = 'order_items';
  protected primaryKey = 'order_item_id';
  protected logger = new Logger(OrderItemRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }
}
