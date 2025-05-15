import { Injectable, NotFoundException } from '@nestjs/common';
import { VoucherRepository, Voucher } from './voucher.repository';

@Injectable()
export class VoucherService {
  constructor(private readonly voucherRepo: VoucherRepository) {}

  async validateVoucher(code: string, orderAmount: number): Promise<Voucher> {
    const voucher = await this.voucherRepo.findByCode(code);

    if (!voucher) {
      throw new NotFoundException('Voucher not found or inactive');
    }

    // Check if voucher is expired
    if (voucher.expiry_date && new Date() > new Date(voucher.expiry_date)) {
      throw new NotFoundException('Voucher has expired');
    }

    // Check minimum order amount
    if (voucher.min_order_amount && orderAmount < voucher.min_order_amount) {
      throw new NotFoundException(
        `Order amount must be at least $${voucher.min_order_amount}`,
      );
    }

    return voucher;
  }

  calculateDiscountedAmount(voucher: Voucher, orderAmount: number): number {
    if (voucher.discount_type === 'percentage') {
      const discountAmount = (orderAmount * voucher.discount_value) / 100;
      return orderAmount - discountAmount;
    } else {
      return Math.max(0, orderAmount - voucher.discount_value);
    }
  }
}
