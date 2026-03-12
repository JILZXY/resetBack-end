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
exports.GetLogHistoryUseCase = void 0;
const common_1 = require("@nestjs/common");
const daily_log_repository_1 = require("../infrastructure/repositories/daily-log.repository");
const sponsorship_repository_1 = require("../../sponsorship/infrastructure/repositories/sponsorship.repository");
let GetLogHistoryUseCase = class GetLogHistoryUseCase {
    logRepo;
    sponsorRepo;
    constructor(logRepo, sponsorRepo) {
        this.logRepo = logRepo;
        this.sponsorRepo = sponsorRepo;
    }
    async execute(userId, filter, requestedUserId) {
        const targetUserId = requestedUserId || userId;
        if (userId !== targetUserId) {
            const isActiveSponsor = await this.sponsorRepo.checkActiveSponsorship(userId, targetUserId);
            if (!isActiveSponsor) {
                throw new common_1.HttpException('No tienes permisos para ver el historial de este usuario', common_1.HttpStatus.FORBIDDEN);
            }
        }
        const from = filter.from ? new Date(filter.from) : undefined;
        const to = filter.to ? new Date(filter.to) : undefined;
        return this.logRepo.findHistory(targetUserId, from, to);
    }
};
exports.GetLogHistoryUseCase = GetLogHistoryUseCase;
exports.GetLogHistoryUseCase = GetLogHistoryUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [daily_log_repository_1.DailyLogRepository,
        sponsorship_repository_1.SponsorshipRepository])
], GetLogHistoryUseCase);
//# sourceMappingURL=get-log-history.usecase.js.map