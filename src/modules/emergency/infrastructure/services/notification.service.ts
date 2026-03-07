// src/modules/emergency/infrastructure/services/notification.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  private isConfigured = false;
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('brevo.apiKey') || '';
    this.fromEmail =
      this.config.get<string>('brevo.fromEmail') || 'no-reply@reset.app';
    this.fromName = this.config.get<string>('brevo.fromName') || 'ReSet App';

    if (!this.apiKey || this.apiKey === 'not_configured') {
      console.warn(
        '⚠️  Brevo not configured or invalid API key - emails will be skipped',
      );
      this.isConfigured = false;
      return;
    }

    this.isConfigured = true;
    console.log('Brevo configured');
  }

  private async sendEmail(
    toEmail: string,
    toName: string,
    subject: string,
    htmlContent: string,
  ) {
    if (!this.isConfigured) return;

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': this.apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { email: this.fromEmail, name: this.fromName },
          to: [{ email: toEmail, name: toName || 'Contacto' }],
          subject,
          htmlContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Brevo API error: ${response.status} ${errorData}`);
      }

      console.log(`Email sent to ${toEmail}`);
    } catch (error: any) {
      console.error('Email sending error:', error?.message ?? error);
      throw error;
    }
  }

  private getBaseTemplate(title: string, content: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono&display=swap" rel="stylesheet">
          <style>
            body { 
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
              line-height: 1.6; 
              color: #334155; 
              margin: 0; 
              padding: 0; 
              background-color: #f1f5f9; 
            }
            .wrapper {
              padding: 40px 20px;
            }
            .washi-tape {
              width: 120px;
              height: 30px;
              background-color: #94a3b8;
              opacity: 0.6;
              margin: -15px auto;
              position: relative;
              z-index: 10;
              transform: rotate(-2deg);
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: #ffffff; 
              border: 1px solid #e2e8f0;
              position: relative;
            }
            .header { 
              padding: 60px 40px 20px; 
              text-align: center; 
            }
            .brand {
              font-family: 'Playfair Display', serif;
              font-style: italic;
              font-size: 32px;
              color: #0f172a;
              margin: 0;
            }
            .subtitle {
              font-family: 'JetBrains Mono', monospace;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #64748b;
              margin-top: 8px;
            }
            .content { 
              padding: 0 40px 40px; 
              font-family: 'Helvetica Neue', Arial, sans-serif;
            }
            .content h2 {
              font-family: 'Playfair Display', serif;
              font-size: 24px;
              color: #1e293b;
              margin-top: 0;
              font-weight: 400;
            }
            .footer { 
              padding: 30px 40px; 
              text-align: center; 
              font-size: 12px; 
              color: #94a3b8; 
              border-top: 1px solid #f1f5f9;
            }
            .button-container {
              text-align: center;
              margin-top: 30px;
            }
            .button { 
              display: inline-block; 
              padding: 14px 28px; 
              background-color: #0d9488; 
              color: #ffffff !important; 
              text-decoration: none; 
              font-size: 14px;
              font-weight: 500;
              border-radius: 4px;
              box-shadow: 0 4px 12px rgba(13, 148, 136, 0.2);
            }
            .alert-box { 
              background-color: #fff1f2; 
              border-left: 4px solid #e11d48; 
              padding: 20px; 
              margin: 30px 0; 
              color: #9f1239;
            }
            .quote {
              border-left: 2px solid #0d9488;
              padding-left: 20px;
              font-style: italic;
              color: #64748b;
              margin: 25px 0;
            }
            p { margin: 16px 0; }
            strong { color: #1e293b; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="washi-tape"></div>
            <div class="container">
              <div class="header">
                <h1 class="brand">ReSet</h1>
                <div class="subtitle">Acompañamiento Digital</div>
              </div>
              <div class="content">
                ${content}
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ReSet App. Un espacio para sanar.</p>
                <p>Este es un correo automático. Por favor, no respondas directamente.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
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

    await this.sendEmail(
      contactEmail,
      'Contacto de Apoyo',
      'NOTIFICACIÓN CRÍTICA: Alerta de Emergencia - ReSet',
      this.getBaseTemplate('Alerta de Emergencia', content),
    );
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    if (!this.isConfigured) {
      console.log(`[MOCK] Welcome email to ${userEmail}`);
      return;
    }

    const content = `
      <h2>Bienvenido a casa, ${userName}.</h2>
      <p>Gracias por confiar en <strong>ReSet</strong>. Estamos aquí para acompañarte en cada paso de tu camino hacia el bienestar con herramientas diseñadas para tu proceso.</p>
      <p>Nuestra plataforma te ofrece la red de apoyo y la estructura necesaria para fortalecer tu camino día a día.</p>
      <div class="button-container">
        <a href="https://resetapp.tech/dashboard" class="button">Comenzar mi Proceso</a>
      </div>
      <p style="margin-top: 40px; font-style: italic; color: #64748b;">"El primer paso no te lleva a donde quieres ir, pero te saca de donde estás."</p>
    `;

    await this.sendEmail(
      userEmail,
      userName,
      'Bienvenido a ReSet - Tu camino de sanación comienza aquí',
      this.getBaseTemplate('Bienvenida', content),
    );
  }
}
