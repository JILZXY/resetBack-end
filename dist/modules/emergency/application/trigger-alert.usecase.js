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
exports.TriggerAlertUseCase = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const contact_repository_1 = require("../infrastructure/repositories/contact.repository");
const notification_service_1 = require("../infrastructure/services/notification.service");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
let TriggerAlertUseCase = class TriggerAlertUseCase {
    contactRepo;
    notificationService;
    prisma;
    constructor(contactRepo, notificationService, prisma) {
        this.contactRepo = contactRepo;
        this.notificationService = notificationService;
        this.prisma = prisma;
    }
    async execute(userId, dto = {}) {
        let alertId;
        try {
            const result = await this.prisma.$queryRaw(client_1.Prisma.sql `SELECT emergency.fn_trigger_alert(${userId}::uuid) AS alert_id`);
            alertId = result[0].alert_id;
        }
        catch (error) {
            const msg = error?.message || 'Error al activar la alerta de emergencia';
            if (msg.includes('no tiene contactos')) {
                throw new common_1.HttpException({
                    code: 'NO_CONTACTS_FOUND',
                    message: 'No tienes contactos de apoyo activos. Agrega al menos uno antes de activar una alerta',
                    details: {},
                }, common_1.HttpStatus.NOT_FOUND);
            }
            if (msg.includes('no tiene adicci')) {
                throw new common_1.HttpException({
                    code: 'ADDICTION_NOT_FOUND',
                    message: 'El usuario no tiene una adicción activa registrada',
                    details: { user_id: userId },
                }, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException(msg, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const contacts = await this.contactRepo.findAllByUserId(userId);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        try {
            await Promise.all(contacts
                .filter((c) => c.email)
                .map((contact) => this.notificationService.sendEmergencyAlert(contact.email, user?.name ?? 'Un usuario', dto.resolutionNotes)));
        }
        catch (notificationError) {
            throw new common_1.HttpException({
                code: 'NOTIFICATION_FAILURE',
                message: 'La alerta fue registrada pero hubo un error al enviar las notificaciones',
                details: {
                    alertId,
                    error: notificationError?.message || 'Error desconocido',
                },
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            alertId,
            notifiedContacts: contacts.filter((c) => c.email).length,
        };
    }
};
exports.TriggerAlertUseCase = TriggerAlertUseCase;
exports.TriggerAlertUseCase = TriggerAlertUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [contact_repository_1.ContactRepository,
        notification_service_1.NotificationService,
        prisma_service_1.PrismaService])
], TriggerAlertUseCase);
//# sourceMappingURL=trigger-alert.usecase.js.map