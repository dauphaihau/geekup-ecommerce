import { Module } from '@nestjs/common';
import { AdminVoucherController } from './admin-voucher.controller';
import { VoucherModule } from '@modules/api/voucher/voucher.module';
import { AdminVoucherService } from './admin-voucher.service';

@Module({
  imports: [VoucherModule],
  controllers: [AdminVoucherController],
  providers: [AdminVoucherService],
  exports: [AdminVoucherService],
})
export class AdminVoucherModule {}
