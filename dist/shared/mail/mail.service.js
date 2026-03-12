"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let MailService = MailService_1 = class MailService {
    configService;
    logger = new common_1.Logger(MailService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async sendEmail(to, subject, htmlContent) {
        const apiKey = this.configService.get('brevo.apiKey');
        const fromEmail = this.configService.get('brevo.fromEmail');
        const fromName = this.configService.get('brevo.fromName') || 'ReSet App';
        if (!apiKey || apiKey === 'not_configured') {
            this.logger.warn('Brevo API key not configured, skipping email');
            return;
        }
        try {
            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'api-key': apiKey,
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    sender: { email: fromEmail, name: fromName },
                    to: [{ email: to }],
                    subject,
                    htmlContent,
                }),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Brevo API error: ${response.status} ${errorData}`);
            }
            this.logger.log(`Email sent to ${to} with subject: ${subject}`);
        }
        catch (error) {
            this.logger.error(`Error sending email to ${to}: ${error.message}`);
            throw error;
        }
    }
    getBaseTemplate(title, content) {
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
    getPrimaryFrontendUrl() {
        const urls = this.configService.get('app.frontendUrl') || '';
        const urlList = urls.split(',').map((u) => u.trim());
        const isProd = this.configService.get('app.nodeEnv') === 'production';
        if (isProd) {
            const prodUrl = urlList.find((u) => u.startsWith('https') && !u.includes('localhost'));
            return prodUrl || urlList[0] || 'https://reset-app.tech';
        }
        return urlList[0] || 'http://localhost:3000';
    }
    async sendVerificationEmail(to, token) {
        const subject = 'Verifica tu correo electrónico - ReSet';
        const frontendUrl = this.getPrimaryFrontendUrl();
        const content = `
      <h2>Confirma tu identidad</h2>
      <p>Gracias por iniciar tu proceso en <strong>ReSet</strong>. Para asegurar tu cuenta, por favor utiliza el siguiente enlace de verificación:</p>
      <div class="button-container">
        <a href="${frontendUrl}/verify-email?token=${token}" class="button">Verificar mi Cuenta</a>
      </div>
      <p style="margin-top: 30px;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
      <p style="font-size: 12px; color: #64748b;">${frontendUrl}/verify-email?token=${token}</p>
    `;
        return this.sendEmail(to, subject, this.getBaseTemplate('Verificación', content));
    }
    async sendPasswordReset(to, token) {
        const subject = 'Restablecer tu contraseña - ReSet';
        const frontendUrl = this.getPrimaryFrontendUrl();
        const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
        const content = `
      <h2>Recuperación de Acceso</h2>
      <p>Has solicitado restablecer tu contraseña. Entendemos que estos momentos pueden ser difíciles, estamos aquí para facilitarte el camino.</p>
      <div class="button-container">
        <a href="${resetUrl}" class="button">Cambiar Contraseña</a>
      </div>
      <p style="margin-top: 30px;">Si no solicitaste este cambio, puedes ignorar este correo con seguridad. Tu cuenta permanece protegida.</p>
      <p>Este enlace expirará en 1 hora.</p>
    `;
        return this.sendEmail(to, subject, this.getBaseTemplate('Recuperación', content));
    }
    async sendFarewellEmail(to, userName) {
        const subject = 'Cuenta eliminada correctamente - ReSet';
        const content = `
      <h2>Te deseamos lo mejor, ${userName}.</h2>
      <p>Confirmamos que tu cuenta en <strong>ReSet</strong> ha sido eliminada según lo solicitaste.</p>
      <p>Lamentamos que te vayas, pero respetamos tu decisión. Recuerda que nuestras puertas siempre estarán abiertas si decides retomar tu camino con nosotros en el futuro.</p>
      <div class="quote">
        <p>"Cada final es un nuevo comienzo."</p>
      </div>
      <p>Gracias por habernos permitido acompañarte durante este tiempo.</p>
    `;
        return this.sendEmail(to, subject, this.getBaseTemplate('Despedida', content));
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map