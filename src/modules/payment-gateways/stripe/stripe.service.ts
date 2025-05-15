import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '@modules/payment-gateways/stripe/stripe.module';

@Injectable()
export class StripeService {
  constructor(@Inject(STRIPE_CLIENT) private stripe: Stripe) {}

  async createCustomer(email: string) {
    return this.stripe.customers.create({ email });
  }

  async createPaymentIntent(amount: number, currency: string) {
    return this.stripe.paymentIntents.create({
      amount,
      currency,
    });
  }
}
