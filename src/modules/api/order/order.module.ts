import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CartModule } from '@modules/api/cart/cart.module';
import { OrderRepository } from './repositories/order.repository';
import {
  PaymentMethodRepository,
  PaymentTransactionRepository,
} from '@modules/api/payment/repositories/payment.repository';
import { StripeModule } from '@modules/payment-gateways/stripe/stripe.module';
import { ProductModule } from '@modules/api/product/product.module';
import { VoucherModule } from '@modules/api/voucher/voucher.module';
import { AddressModule } from '@modules/api/address/address.module';
import { MailModule } from '@modules/mail/mail.module';
import { OrderVoucherRepository } from '@modules/api/order/repositories/order-voucher.repository';
import { OrderItemRepository } from '@modules/api/order/repositories/order-item.repository';

@Module({
  imports: [
    CartModule,
    StripeModule,
    ProductModule,
    VoucherModule,
    AddressModule,
    MailModule,
  ],
  providers: [
    OrderService,
    OrderRepository,
    OrderItemRepository,
    OrderVoucherRepository,
    PaymentMethodRepository,
    PaymentTransactionRepository,
  ],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
