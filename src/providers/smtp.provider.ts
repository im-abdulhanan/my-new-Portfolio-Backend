import nodemailer, { Transporter } from 'nodemailer';
import { mailConfig } from '../config/mail.js';
import { logger } from '../lib/logger.js';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export class SmtpProvider {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: {
        user: mailConfig.auth.user,
        pass: mailConfig.auth.pass,
      },
    });
  }

  public async sendMail(options: SendMailOptions): Promise<void> {
    const mailOptions = {
      from: `"${mailConfig.fromName}" <${mailConfig.auth.user}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    };

    await this.transporter.sendMail(mailOptions);
  }

  public async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('SMTP transporter connection verified successfully');
      return true;
    } catch (error) {
      logger.warn({ error }, 'SMTP connection verification failed');
      return false;
    }
  }

  public close(): void {
    this.transporter.close();
    logger.info('SMTP transporter connection closed');
  }
}

export const smtpProvider = new SmtpProvider();
