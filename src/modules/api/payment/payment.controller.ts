import { Controller, Post, Res, Req, Headers, Inject } from '@nestjs/common';
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

  @Post('stripe/webhook')
  @ApiExcludeEndpoint()
  // handleEvents(@Body() paymentCallbackDto: PaymentCallbackDto) {
  async handleWebhook(
    @Req() req,
    @Res() res,
    @Headers('stripe-signature') signature: string,
  ) {
    const event = this.stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      // process.env.STRIPE_WEBHOOK_SECRET,
      'whsec_5ccc90f9706489afadef1c673e06e59efc3709a633b83d6407043ca2435d229e',
    );

    console.log('event-type', event.type);

    // Handle event.type
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('csc');
        // Handle success
        break;

    }

    // return this.paymentService.handlePaymentCallback(paymentCallbackDto);
  }
}
