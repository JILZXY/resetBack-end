import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { SupportContactEntity } from '../../domain/support-contact.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly config: ConfigService) {
    sgMail.setApiKey(this.config.get<string>('SENDGRID_API_KEY') ?? '');
  }

  async sendEmergencyAlert(
    contacts: SupportContactEntity[],
    userName: string,
  ): Promise<void> {
    const fromEmail = this.config.get<string>('SENDGRID_FROM_EMAIL') ?? '';
    const fromName = this.config.get<string>('SENDGRID_FROM_NAME') ?? 'Reset App';

    const emailContacts = contacts.filter((c) => c.email && c.isActive);

    if (emailContacts.length === 0) {
      this.logger.warn(`No hay contactos con email activos para notificar`);
      return;
    }

    const messages = emailContacts.map((contact) => ({
      to: contact.email as string,
      from: { email: fromEmail, name: fromName },
      subject: `⚠️ Alerta de emergencia — ${userName} necesita apoyo`,
      html: this.buildEmailTemplate(userName, contact.contactName),
    }));

    try {
      await Promise.all(messages.map((msg) => sgMail.send(msg)));
      this.logger.log(
        `Alertas enviadas a ${emailContacts.length} contacto(s) de ${userName}`,
      );
    } catch (error) {
      this.logger.error('Error al enviar alertas por SendGrid', error);
    }
  }

  private buildEmailTemplate(userName: string, contactName: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e53e3e;">⚠️ Alerta de Emergencia — Reset App</h2>
        <p>Hola <strong>${contactName}</strong>,</p>
        <p>
          <strong>${userName}</strong> ha activado el botón de emergencia en la 
          aplicación Reset. Esto significa que necesita apoyo en este momento.
        </p>
        <p>Por favor comunícate con él/ella lo antes posible.</p>
        <hr style="border: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #718096; font-size: 12px;">
          Este mensaje fue enviado automáticamente por Reset App. 
          Si crees que recibiste este correo por error, ignóralo.
        </p>
      </div>
    `;
  }
}