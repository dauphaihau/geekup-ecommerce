import { Module } from '@nestjs/common';
import { AdminVoucherModule } from './voucher/admin-voucher.module';

@Module({
  imports: [AdminVoucherModule],
  exports: [AdminVoucherModule],
})
export class AdminModule {} 