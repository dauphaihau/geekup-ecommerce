import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherRepository } from './voucher.repository';

@Module({
  providers: [VoucherService, VoucherRepository],
  exports: [VoucherService, VoucherRepository],
})
export class VoucherModule {}
