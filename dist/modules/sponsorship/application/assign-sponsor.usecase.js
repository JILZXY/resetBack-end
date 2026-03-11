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
exports.RequestSponsorshipUseCase = void 0;
const common_1 = require("@nestjs/common");
const sponsorship_repository_1 = require("../infrastructure/repositories/sponsorship.repository");
const user_repository_1 = require("../../auth/infrastructure/repositories/user.repository");
const notification_repository_1 = require("../../forum/infrastructure/repositories/notification.repository");
const notification_gateway_1 = require("../../forum/notification.gateway");
const notification_service_1 = require("../../emergency/infrastructure/services/notification.service");
let RequestSponsorshipUseCase = class RequestSponsorshipUseCase {
    sponsorshipRepo;
    userRepo;
    notificationRepo;
    notificationGateway;
    emailService;
    constructor(sponsorshipRepo, userRepo, notificationRepo, notificationGateway, emailService) {
        this.sponsorshipRepo = sponsorshipRepo;
        this.userRepo = userRepo;
        this.notificationRepo = notificationRepo;
        this.notificationGateway = notificationGateway;
        this.emailService = emailService;
    }
    async execute(userId, dto) {
        const sponsor = await this.userRepo.findBySponsorCode(dto.sponsor_code);
        if (!sponsor || sponsor.role !== 'PADRINO') {
            throw new common_1.HttpException({
                code: 'SPONSOR_NOT_FOUND',
                message: 'Código de padrino no válido o no encontrado',
                details: {},
            }, common_1.HttpStatus.NOT_FOUND);
        }
        if (sponsor.id === userId) {
            throw new common_1.HttpException({
                code: 'SELF_SPONSORSHIP',
                message: 'No puedes ser tu propio padrino',
                details: {},
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const existingActive = await this.sponsorshipRepo.findActiveByAddictId(userId);
        if (existingActive) {
            throw new common_1.HttpException({
                code: 'ALREADY_HAS_SPONSOR',
                message: 'Ya tienes un padrino activo',
                details: {},
            }, common_1.HttpStatus.CONFLICT);
        }
        const existingPending = await this.sponsorshipRepo.findPendingByAddictId(userId);
        if (existingPending) {
            throw new common_1.HttpException({
                code: 'PENDING_REQUEST_EXISTS',
                message: 'Ya tienes una solicitud de apadrinamiento pendiente',
                details: {},
            }, common_1.HttpStatus.CONFLICT);
        }
        const sponsorship = await this.sponsorshipRepo.createRequest(sponsor.id, userId);
        this.notifySponsorship(userId, sponsor.id, sponsor.email).catch(() => { });
        return {
            message: 'Solicitud de apadrinamiento enviada exitosamente',
            sponsorship,
        };
    }
    async notifySponsorship(actorId, sponsorId, sponsorEmail) {
        const notification = await this.notificationRepo.create({
            userId: sponsorId,
            actorId,
            type: 'SPONSORSHIP_REQUEST',
            targetId: sponsorId,
        });
        this.notificationGateway.sendToUser(sponsorId, notification);
        const actor = await this.userRepo.findById(actorId);
        await this.emailService.sendEmergencyAlert(sponsorEmail, actor?.name ?? 'Un usuario', 'Ha solicitado ser tu ahijado. Entra a la app para revisar la solicitud.');
    }
};
exports.RequestSponsorshipUseCase = RequestSponsorshipUseCase;
exports.RequestSponsorshipUseCase = RequestSponsorshipUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sponsorship_repository_1.SponsorshipRepository,
        user_repository_1.UserRepository,
        notification_repository_1.NotificationRepository,
        notification_gateway_1.NotificationGateway,
        notification_service_1.NotificationService])
], RequestSponsorshipUseCase);
//# sourceMappingURL=assign-sponsor.usecase.js.map