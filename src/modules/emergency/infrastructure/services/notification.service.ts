// src/modules/emergency/infrastructure/services/notification.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const sgMail = require('@sendgrid/mail');

@Injectable()
export class NotificationService {
  private isConfigured = false;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('sendgrid.apiKey');

    if (!apiKey || apiKey === 'not_configured' || !apiKey.startsWith('SG.')) {
      console.warn('⚠️  SendGrid not configured or invalid API key - emails will be skipped');
      this.isConfigured = false;
      return;
    }

    sgMail.setApiKey(apiKey);
    this.isConfigured = true;
    console.log('SendGrid configured');
  }

  async sendEmergencyAlert(
    contactEmail: string,
    userName: string,
    message?: string,
  ): Promise<void> {
    if (!this.isConfigured) {
      console.log(`[MOCK] Emergency email to ${contactEmail} from ${userName}`);
      return;
    }

    const msg = {
      to: contactEmail,
      from: {
        email: this.config.get<string>('sendgrid.fromEmail')!,
        name: this.config.get<string>('sendgrid.fromName'),
      },
      subject: 'Alerta de Emergencia - ReSet',
      html: `
        <h2>Alerta de Emergencia</h2>
        <p><strong>${userName}</strong> necesita tu apoyo inmediato.</p>
        <p>Mensaje: ${message}</p>
        <p>Por favor, comunícate con esta persona lo antes posible.</p>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${contactEmail}`);
    } catch (error) {
      console.warn('SendGrid error (email not sent, alert still saved):', error?.message ?? error);
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    if (!this.isConfigured) {
      console.log(`[MOCK] Welcome email to ${userEmail}`);
      return;
    }

    const msg = {
      to: userEmail,
      from: {
        email: this.config.get<string>('sendgrid.fromEmail')!,
        name: this.config.get<string>('sendgrid.fromName'),
      },
      subject: 'Bienvenido a ReSet',
      html: `
        <h2>¡Hola ${userName}!</h2>
        <p>Te damos la bienvenida a ReSet, tu plataforma de apoyo en recuperación.</p>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`Welcome email sent to ${userEmail}`);
    } catch (error) {
      console.warn('Failed to send welcome email:', error.message);
    }
  }
}
