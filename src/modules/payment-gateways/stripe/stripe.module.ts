import { Logger, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

const logger = new Logger('StripeModule');

export const STRIPE_CLIENT = 'STRIPE_CLIENT';

const stripeProvider: Provider = {
  provide: STRIPE_CLIENT,
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-04-30.basil',
    });

    try {
      await stripe.accounts.retrieve();
      logger.log('Successfully connected to Stripe');
    } catch (error) {
      logger.error('Failed to connect to Stripe', error);
      throw new Error('Unable to connect to Stripe');
    }
    return stripe;
  },
};

@Module({
  controllers: [],
  providers: [stripeProvider],
  exports: [stripeProvider],
})
export class StripeModule {}
