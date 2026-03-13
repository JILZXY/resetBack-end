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
exports.RejectSponsorshipUseCase = void 0;
const common_1 = require("@nestjs/common");
const sponsorship_repository_1 = require("../infrastructure/repositories/sponsorship.repository");
const notification_repository_1 = require("../../forum/infrastructure/repositories/notification.repository");
const notification_gateway_1 = require("../../forum/notification.gateway");
let RejectSponsorshipUseCase = class RejectSponsorshipUseCase {
    sponsorshipRepo;
    notificationRepo;
    notificationGateway;
    constructor(sponsorshipRepo, notificationRepo, notificationGateway) {
        this.sponsorshipRepo = sponsorshipRepo;
        this.notificationRepo = notificationRepo;
        this.notificationGateway = notificationGateway;
    }
    async execute(userId) {
        const pending = await this.sponsorshipRepo.findPendingBySponsorId(userId);
        if (!pending) {
            throw new common_1.HttpException({
                code: 'NO_PENDING_REQUEST',
                message: 'No tienes solicitudes de apadrinamiento pendientes',
                details: {},
            }, common_1.HttpStatus.NOT_FOUND);
        }
        await this.sponsorshipRepo.reject(pending.id);
        await this.notificationRepo.markAsReadByCriteria({
            userId: userId,
            actorId: pending.addictId,
            type: 'SPONSORSHIP_REQUEST',
        });
        this.notifyAddict(userId, pending.addictId).catch(() => { });
        return { message: 'Solicitud de apadrinamiento rechazada' };
    }
    async notifyAddict(sponsorId, addictId) {
        const notification = await this.notificationRepo.create({
            userId: addictId,
            actorId: sponsorId,
            type: 'SPONSORSHIP_REJECTED',
            targetId: addictId,
        });
        this.notificationGateway.sendToUser(addictId, notification);
    }
};
exports.RejectSponsorshipUseCase = RejectSponsorshipUseCase;
exports.RejectSponsorshipUseCase = RejectSponsorshipUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sponsorship_repository_1.SponsorshipRepository,
        notification_repository_1.NotificationRepository,
        notification_gateway_1.NotificationGateway])
], RejectSponsorshipUseCase);
//# sourceMappingURL=reject-sponsorship.usecase.js.map