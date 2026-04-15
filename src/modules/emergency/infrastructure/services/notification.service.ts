import { Injectable } from '@nestjs/common';
import { MailService } from 'src/shared/mail/mail.service';

@Injectable()
export class NotificationService {
  constructor(private mailService: MailService) {}

  async sendEmergencyAlert(
    contactEmail: string,
    userName: string,
    message?: string,
  ): Promise<void> {
    const subject = 'NOTIFICACIÓN CRÍTICA: Alerta de Emergencia - ReSet';
    const content = `
      <h2>Notificación Crítica</h2>
      <p>Estimado contacto de apoyo,</p>
      <div class="alert-box">
        <p><strong>${userName}</strong> ha activado una alerta de emergencia desde su aplicación ReSet y solicita tu intervención inmediata.</p>
      </div>
      ${message ? `<div class="quote"><p>${message}</p></div>` : ''}
      <p>Por favor, intenta ponerte en contacto con <strong>${userName}</strong> a la brevedad posible para brindarle el apoyo necesario.</p>
      <p>Tu rol como red de seguridad es fundamental en este camino de restauración.</p>
    `;

    await this.mailService.sendEmail(
      contactEmail,
      subject,
      this.mailService.getBaseTemplate('Alerta de Emergencia', content),
    );
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    const subject = 'Bienvenido a ReSet - Tu camino de sanación comienza aquí';
    const dashboardUrl = `${this.mailService.getPrimaryFrontendUrl()}/dashboard`;
    const content = `
      <h2>Bienvenido a casa, ${userName}.</h2>
      <p>Gracias por confiar en <strong>ReSet</strong>. Estamos aquí para acompañarte en cada paso de tu camino hacia el bienestar con herramientas diseñadas para tu proceso.</p>
      <p>Nuestra plataforma te ofrece la red de apoyo y la estructura necesaria para fortalecer tu camino día a día.</p>
      <div class="button-container">
        <a href="${dashboardUrl}" class="button">Comenzar mi Proceso</a>
      </div>
      <p style="margin-top: 40px; font-style: italic; color: #64748b;">"El primer paso no te lleva a donde quieres ir, pero te saca de donde estás."</p>
    `;

    await this.mailService.sendEmail(
      userEmail,
      subject,
      this.mailService.getBaseTemplate('Bienvenida', content),
    );
  }
}
