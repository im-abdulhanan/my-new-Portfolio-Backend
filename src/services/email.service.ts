import { mailConfig } from '../config/mail.js';
import { logger } from '../lib/logger.js';
import { smtpProvider } from '../providers/smtp.provider.js';
import { ADMIN_EMAIL_SUBJECT, renderAdminTemplate } from '../templates/admin.template.js';
import { AUTOREPLY_EMAIL_SUBJECT, renderAutoReplyTemplate } from '../templates/autoreply.template.js';
import { ContactRequestBody } from '../types/contact.types.js';

export class EmailService {
  public async sendInquiryAndAutoReply(
    data: ContactRequestBody,
    requestId: string,
  ): Promise<void> {
    const startTime = Date.now();

    // 1. Render templates
    const adminTemplate = renderAdminTemplate(data);
    const autoReplyTemplate = renderAutoReplyTemplate(data.fullName);

    // 2. Dispatch admin inquiry email
    await smtpProvider.sendMail({
      to: mailConfig.adminEmail,
      subject: ADMIN_EMAIL_SUBJECT,
      html: adminTemplate.html,
      text: adminTemplate.text,
      replyTo: data.email,
    });

    const duration = Date.now() - startTime;
    logger.info(
      {
        from: data.email,
        requestId,
        durationMs: duration,
      },
      `✓ Email sent | from: ${data.email} | Request ID: ${requestId} | Duration: ${duration}ms`,
    );

    // 3. Dispatch auto-reply confirmation email (non-blocking for response speed, but awaited or handled gracefully)
    try {
      await smtpProvider.sendMail({
        to: data.email,
        subject: AUTOREPLY_EMAIL_SUBJECT,
        html: autoReplyTemplate.html,
        text: autoReplyTemplate.text,
      });
      logger.info({ to: data.email, requestId }, `✓ Auto-reply email dispatched to visitor`);
    } catch (error) {
      logger.warn({ error, to: data.email, requestId }, `Auto-reply email dispatch failed`);
    }
  }
}

export const emailService = new EmailService();
