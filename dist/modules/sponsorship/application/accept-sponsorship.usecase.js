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
exports.AcceptSponsorshipUseCase = void 0;
const common_1 = require("@nestjs/common");
const sponsorship_repository_1 = require("../infrastructure/repositories/sponsorship.repository");
const notification_repository_1 = require("../../forum/infrastructure/repositories/notification.repository");
const notification_gateway_1 = require("../../forum/notification.gateway");
const user_repository_1 = require("../../auth/infrastructure/repositories/user.repository");
let AcceptSponsorshipUseCase = class AcceptSponsorshipUseCase {
    sponsorshipRepo;
    notificationRepo;
    notificationGateway;
    userRepo;
    constructor(sponsorshipRepo, notificationRepo, notificationGateway, userRepo) {
        this.sponsorshipRepo = sponsorshipRepo;
        this.notificationRepo = notificationRepo;
        this.notificationGateway = notificationGateway;
        this.userRepo = userRepo;
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
        const sponsorship = await this.sponsorshipRepo.accept(pending.id);
        await this.notificationRepo.markAsReadByCriteria({
            userId: userId,
            actorId: pending.addictId,
            type: 'SPONSORSHIP_REQUEST',
        });
        this.notifyAddict(userId, pending.addictId).catch(() => { });
        return {
            message: 'Solicitud de apadrinamiento aceptada exitosamente',
            sponsorship,
        };
    }
    async notifyAddict(sponsorId, addictId) {
        const actor = await this.userRepo.findById(sponsorId);
        const notification = await this.notificationRepo.create({
            userId: addictId,
            actorId: sponsorId,
            actorName: actor?.name,
            actorAvatarUrl: actor?.avatarUrl,
            type: 'SPONSORSHIP_ACCEPTED',
            targetId: addictId,
        });
        this.notificationGateway.sendToUser(addictId, notification);
    }
};
exports.AcceptSponsorshipUseCase = AcceptSponsorshipUseCase;
exports.AcceptSponsorshipUseCase = AcceptSponsorshipUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sponsorship_repository_1.SponsorshipRepository,
        notification_repository_1.NotificationRepository,
        notification_gateway_1.NotificationGateway,
        user_repository_1.UserRepository])
], AcceptSponsorshipUseCase);
//# sourceMappingURL=accept-sponsorship.usecase.js.map