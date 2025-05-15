import { Controller, Post, Res, Req, Headers, Inject, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { STRIPE_CLIENT } from '@modules/payment-gateways/stripe/stripe.module';
import Stripe from 'stripe';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
  ) {}

  @Get('methods')
  async getPaymentMethods() {
    return this.paymentService.getPaymentMethods();
  }

  @Post('stripe/webhook')
  @ApiExcludeEndpoint()
  async handleWebhook(
    @Req() req,
    @Res() res,
    @Headers('stripe-signature') signature: string,
  ) {
    const event = this.stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log('event-type', event.type);

    // Handle event.type
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle success
        break;
    }

    // return this.paymentService.handlePaymentCallback(paymentCallbackDto);
  }
}
