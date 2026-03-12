import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sib from '@getbrevo/brevo';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private apiInstance: sib.TransactionalEmailsApi;

  constructor(private readonly configService: ConfigService) {
    this.apiInstance = new sib.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      sib.TransactionalEmailsApiApiKeys.ApiKey,
      this.configService.get<string>('BREVO_API_KEY'),
    );
  }

  async sendEmail(to: string, subject: string, htmlContent: string) {
    const sendSmtpEmail = new sib.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = {
      name: 'ReSet Support',
      email: this.configService.get<string>('BREVO_SENDER_EMAIL'),
    };
    sendSmtpEmail.to = [{ email: to }];

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      this.logger.log(`Email sent to ${to} with subject: ${subject}`);
    } catch (error) {
      this.logger.error(`Error sending email to ${to}: ${error.message}`);
      throw error;
    }
  }

  async sendVerificationEmail(to: string, code: string) {
    const subject = 'Verifica tu correo electrónico - ReSet';
    const htmlContent = `<h1>Bienvenido a ReSet</h1><p>Tu código de verificación es: <strong>${code}</strong></p>`;
    return this.sendEmail(to, subject, htmlContent);
  }

  async send2FACode(to: string, code: string) {
    const subject = 'Código de acceso (2FA) - ReSet';
    const htmlContent = `<p>Tu código de acceso para iniciar sesión es: <strong>${code}</strong></p>`;
    return this.sendEmail(to, subject, htmlContent);
  }

  async sendPasswordReset(to: string, token: string) {
    const subject = 'Restablecer tu contraseña - ReSet';
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}`;
    const htmlContent = `
      <h1>Recuperación de Contraseña</h1>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Este enlace expirará en 1 hora.</p>
    `;
    return this.sendEmail(to, subject, htmlContent);
  }
}
