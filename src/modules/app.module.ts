import {
  BadRequestException,
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { txMode } from 'pg-promise';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from '@modules/api/auth/auth.module';
import { HomeModule } from '@modules/api/home/home.module';
import appConfig from '../config/app.config';
import databaseConfig from './database/config/database.config';
import authConfig from '@modules/api/auth/config/auth.config';
import {
  APP_INTERCEPTOR,
  APP_PIPE,
  Reflector,
  RouterModule,
} from '@nestjs/core';
import { AdminUserModule } from '@modules/api/admin/user/admin-user.module';
import mailConfig from '@modules/mail/config/mail.config';
import { MailerModule } from '@modules/mailer/mailer.module';
import { MailModule } from '@modules/mail/mail.module';
import { Environment } from '@app/constants/app.constant';
import { FileModule } from '@modules/api/file/file.module';
import fileConfig from '@modules/api/file/config/file.config';
import { OrderModule } from '@modules/api/order/order.module';
import { ProductModule } from '@modules/api/product/product.module';
import { CategoryModule } from '@modules/api/category/category.module';
import { AddressModule } from '@modules/api/address/address.module';
import { CartModule } from '@modules/api/cart/cart.module';
import { PaymentModule } from '@modules/api/payment/payment.module';
import { DATABASE_CONNECTION } from './database/database.provider';
import { AdminVoucherModule } from '@modules/api/admin/voucher/admin-voucher.module';
import redisConfig from '@modules/redis/config/redis.config';
import { AnalyticModule } from '@modules/api/analytic/analytic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV}`,
        '.env', // Fallback
      ],
      load: [
        appConfig,
        databaseConfig,
        authConfig,
        mailConfig,
        fileConfig,
        redisConfig,
      ],
    }),
    DatabaseModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      plugins: [
        new ClsPluginTransactional({
          imports: [DatabaseModule],
          adapter: new TransactionalAdapterPgPromise({
            dbInstanceToken: DATABASE_CONNECTION, // Injection token for the database instance
            defaultTxOptions: {
              mode: new txMode.TransactionMode({
                tiLevel: txMode.isolationLevel.serializable,
              }),
            },
          }),
        }),
      ],
    }),
    MailerModule,
    MailModule,

    // APIs
    HomeModule,
    AuthModule,
    FileModule,
    AdminUserModule,
    AdminVoucherModule,
    RouterModule.register([
      {
        path: 'admin',
        children: [
          {
            path: 'users',
            module: AdminUserModule,
          },
          {
            path: 'vouchers',
            module: AdminVoucherModule,
          },
        ],
      },
    ]),
    OrderModule,
    CategoryModule,
    ProductModule,
    AddressModule,
    CartModule,
    PaymentModule,
    AnalyticModule,
  ],
  providers: [
    /*
     * put all setup pipes, interceptors here instead main.ts
     *  for purpose more modular, DI and testing
     * */
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          disableErrorMessages: process.env.NODE_ENV === Environment.Production,
          whitelist: true,
          transform: true,
          exceptionFactory: (errors) => {
            const messages = errors.map((err) =>
              Object.values(err.constraints).join(', '),
            );
            return new BadRequestException(messages.join('; '));
          },
        }),
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) =>
        new ClassSerializerInterceptor(reflector),
      inject: [Reflector],
    },
  ],
})
export class AppModule {}
