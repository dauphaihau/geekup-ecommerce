import { Injectable, Logger } from '@nestjs/common';
import { MailData } from '@modules/mail/interfaces/mail-data.interface';
import { MailerService } from '@modules/mailer/mailer.service';
import path from 'node:path';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@config/app.config.type';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  public async sendResetPassword(
    mailData: MailData<{ token: string }>,
  ): Promise<void> {
    try {
      const appConfig = this.configService.get<AppConfig>('app');

      const url = new URL(`${appConfig.frontendDomain}/reset-password`);
      url.searchParams.set('token', mailData.data.token);

      await this.mailerService.sendMail({
        to: mailData.to,
        subject: 'Reset Your Password',
        templatePath: path.join(
          process.cwd(),
          'src/modules/mail/templates/reset-password.hbs',
        ),
        context: {
          title: 'Reset Password Request',
          app_name: appConfig.name,
          text1: 'You requested a password reset.',
          text2: 'Click the button below to reset your password.',
          text3: 'If you did not request this, please ignore this email.',
          actionTitle: 'Reset Password',
          url: url.toString(),
          text4: 'Thank you for using our service.',
        },
      });
    } catch (error) {
      this.logger.error('Failed to send reset password email', error);
    }
  }

  public async sendOrderConfirmation(
    mailData: MailData<{
      orderNumber: string;
      orderDate: string;
      items: Array<{ name: string; quantity: number; price: string }>;
      totalAmount: string;
    }>,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: mailData.to,
        subject: 'Order Confirmation',
        templatePath: path.join(
          process.cwd(),
          'src/modules/mail/templates/order-confirmation.hbs',
        ),
        context: {
          title: 'Order Confirmation',
          text1: 'Thank you for your order!',
          orderNumber: mailData.data.orderNumber,
          orderDate: mailData.data.orderDate,
          items: mailData.data.items,
          totalAmount: mailData.data.totalAmount,
          text2:
            'You can view your order details by logging into your account.',
          text3: 'If you have any questions, please contact us.',
        },
      });
    } catch (error) {
      this.logger.error('Failed to send order confirmation email', error);
    }
  }
}
