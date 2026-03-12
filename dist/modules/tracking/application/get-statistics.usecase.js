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
exports.GetStatisticsUseCase = void 0;
const common_1 = require("@nestjs/common");
const daily_log_repository_1 = require("../infrastructure/repositories/daily-log.repository");
const sponsorship_repository_1 = require("../../sponsorship/infrastructure/repositories/sponsorship.repository");
let GetStatisticsUseCase = class GetStatisticsUseCase {
    logRepo;
    sponsorRepo;
    constructor(logRepo, sponsorRepo) {
        this.logRepo = logRepo;
        this.sponsorRepo = sponsorRepo;
    }
    async execute(userId, requestedUserId) {
        const targetUserId = requestedUserId || userId;
        if (userId !== targetUserId) {
            const isActiveSponsor = await this.sponsorRepo.checkActiveSponsorship(userId, targetUserId);
            if (!isActiveSponsor) {
                throw new common_1.HttpException('No tienes permisos para ver las estadísticas de este usuario', common_1.HttpStatus.FORBIDDEN);
            }
        }
        const stats = await this.logRepo.getStatistics(targetUserId);
        return {
            dayCounter: stats.day_counter,
            averageCraving: stats.avg_craving,
            averageEmotionalState: stats.avg_emotion,
            streakStatus: stats.streak_status,
            totalRelapses: stats.total_relapses,
        };
    }
};
exports.GetStatisticsUseCase = GetStatisticsUseCase;
exports.GetStatisticsUseCase = GetStatisticsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [daily_log_repository_1.DailyLogRepository,
        sponsorship_repository_1.SponsorshipRepository])
], GetStatisticsUseCase);
//# sourceMappingURL=get-statistics.usecase.js.map