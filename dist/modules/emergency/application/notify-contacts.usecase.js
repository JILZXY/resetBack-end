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
exports.NotifyContactsUseCase = void 0;
const common_1 = require("@nestjs/common");
const contact_repository_1 = require("../infrastructure/repositories/contact.repository");
const notification_service_1 = require("../infrastructure/services/notification.service");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
let NotifyContactsUseCase = class NotifyContactsUseCase {
    contactRepo;
    notificationService;
    prisma;
    constructor(contactRepo, notificationService, prisma) {
        this.contactRepo = contactRepo;
        this.notificationService = notificationService;
        this.prisma = prisma;
    }
    async execute(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const contacts = await this.contactRepo.findAllByUserId(userId);
        await Promise.all(contacts
            .filter((c) => c.email)
            .map((contact) => this.notificationService.sendEmergencyAlert(contact.email, user?.name ?? 'Un usuario')));
    }
};
exports.NotifyContactsUseCase = NotifyContactsUseCase;
exports.NotifyContactsUseCase = NotifyContactsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [contact_repository_1.ContactRepository,
        notification_service_1.NotificationService,
        prisma_service_1.PrismaService])
], NotifyContactsUseCase);
//# sourceMappingURL=notify-contacts.usecase.js.map