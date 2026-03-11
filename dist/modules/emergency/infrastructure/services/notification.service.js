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
const mail_service_1 = require("../../../../shared/mail/mail.service");
let NotificationService = class NotificationService {
    mailService;
    constructor(mailService) {
        this.mailService = mailService;
    }
    async sendEmergencyAlert(contactEmail, userName, message) {
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
        await this.mailService.sendEmail(contactEmail, subject, this.mailService.getBaseTemplate('Alerta de Emergencia', content));
    }
    async sendWelcomeEmail(userEmail, userName) {
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
        await this.mailService.sendEmail(userEmail, subject, this.mailService.getBaseTemplate('Bienvenida', content));
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map