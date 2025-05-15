import { Injectable } from '@nestjs/common';
import fs from 'node:fs/promises';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { MailConfig } from '../mail/config/mail-config.type';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    const mailConfig = configService.get<MailConfig>('mail');
    this.transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      ignoreTLS: mailConfig.ignoreTLS,
      requireTLS: mailConfig.requireTLS,
      auth: {
        user: mailConfig.user,
        pass: mailConfig.password,
      },
    });
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    const mailConfig = this.configService.get<MailConfig>('mail');

    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from ? mailOptions.from : mailConfig.from,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }
}
