import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { DatabaseService } from '@modules/database/database.service';

export interface OrderVoucher {
  order_voucher_id: string;
  order_id: string;
  voucher_id: string;
  applied_discount: number;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class OrderVoucherRepository extends BaseRepository<OrderVoucher> {
  protected tableName = 'order_vouchers';
  protected primaryKey = 'order_voucher_id';
  protected logger = new Logger(OrderVoucherRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }

  async findByOrderId(orderId: string): Promise<OrderVoucher[]> {
    return this.findWhere('order_id = $1', [orderId]);
  }
}
