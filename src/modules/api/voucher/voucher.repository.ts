import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '@common/base.repository';
import { DatabaseService } from '@modules/database/database.service';

export interface Voucher {
  voucher_id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_order_amount: number;
  usage_limit: number;
  expiry_date: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class VoucherRepository extends BaseRepository<Voucher> {
  protected tableName = 'vouchers';
  protected primaryKey = 'voucher_id';
  protected logger = new Logger(VoucherRepository.name);

  constructor(protected dbService: DatabaseService) {
    super(dbService);
  }

  async findByCode(code: string): Promise<Voucher | null> {
    return this.findOne('code = $1 AND is_active = true', [code]);
  }
}
