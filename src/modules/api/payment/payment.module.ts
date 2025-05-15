import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentMethodRepository } from '@modules/api/payment/repositories/payment.repository';
import { StripeModule } from '@modules/payment-gateways/stripe/stripe.module';

@Module({
  imports: [StripeModule],
  providers: [PaymentMethodRepository, PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
