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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sgMail = require('@sendgrid/mail');
let NotificationService = class NotificationService {
    config;
    isConfigured = false;
    constructor(config) {
        this.config = config;
        const apiKey = this.config.get('sendgrid.apiKey');
        if (!apiKey || apiKey === 'not_configured' || !apiKey.startsWith('SG.')) {
            console.warn('⚠️  SendGrid not configured or invalid API key - emails will be skipped');
            this.isConfigured = false;
            return;
        }
        sgMail.setApiKey(apiKey);
        this.isConfigured = true;
        console.log('SendGrid configured');
    }
    async sendEmergencyAlert(contactEmail, userName, message) {
        if (!this.isConfigured) {
            console.log(`[MOCK] Emergency email to ${contactEmail} from ${userName}`);
            return;
        }
        const msg = {
            to: contactEmail,
            from: {
                email: this.config.get('sendgrid.fromEmail'),
                name: this.config.get('sendgrid.fromName'),
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
        }
        catch (error) {
            console.warn('SendGrid error (email not sent, alert still saved):', error?.message ?? error);
        }
    }
    async sendWelcomeEmail(userEmail, userName) {
        if (!this.isConfigured) {
            console.log(`[MOCK] Welcome email to ${userEmail}`);
            return;
        }
        const msg = {
            to: userEmail,
            from: {
                email: this.config.get('sendgrid.fromEmail'),
                name: this.config.get('sendgrid.fromName'),
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
        }
        catch (error) {
            console.warn('Failed to send welcome email:', error.message);
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map