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
exports.GetGodchildProfileUseCase = void 0;
const common_1 = require("@nestjs/common");
const sponsorship_repository_1 = require("../infrastructure/repositories/sponsorship.repository");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
let GetGodchildProfileUseCase = class GetGodchildProfileUseCase {
    sponsorshipRepo;
    prisma;
    constructor(sponsorshipRepo, prisma) {
        this.sponsorshipRepo = sponsorshipRepo;
        this.prisma = prisma;
    }
    async execute(userId) {
        const sponsorship = await this.sponsorshipRepo.findActiveBySponsorId(userId);
        if (!sponsorship) {
            throw new common_1.HttpException({
                code: 'NO_ACTIVE_GODCHILD',
                message: 'No tienes un ahijado activo',
                details: {},
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const addictId = sponsorship.addictId;
        const user = await this.prisma.user.findUnique({
            where: { id: addictId },
            select: {
                id: true,
                name: true,
                role: true,
                created_at: true,
                addictions: {
                    select: {
                        custom_name: true,
                        classification: true,
                        is_active: true,
                        registered_at: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.HttpException('Ahijado no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const stats = await this.prisma.$queryRaw `
      SELECT * FROM core.fn_get_user_stats(${addictId}::uuid)
    `;
        const rawStats = stats[0] || {};
        const recentLogs = await this.prisma.dailyLog.findMany({
            where: { user_id: addictId },
            orderBy: { log_date: 'desc' },
            take: 10,
            include: {
                craving_level: { select: { level: true, label: true } },
                emotional_state: { select: { level: true, label: true } },
            },
        });
        return {
            godchild: {
                id: user.id,
                name: user.name,
                role: user.role,
                createdAt: user.created_at,
                addiction: user.addictions?.[0] ?? null,
            },
            sponsorship: {
                id: sponsorship.id,
                startedAt: sponsorship.startedAt,
                status: sponsorship.status,
            },
            statistics: {
                dayCounter: rawStats.day_counter ?? 0,
                averageCraving: rawStats.avg_craving ?? 0,
                averageEmotionalState: rawStats.avg_emotion ?? 0,
                streakStatus: rawStats.streak_status ?? 'N/A',
                totalRelapses: rawStats.total_relapses ?? 0,
            },
            recentLogs: recentLogs.map((log) => ({
                logDate: log.log_date,
                consumed: log.consumed,
                cravingLevel: log.craving_level,
                emotionalState: log.emotional_state,
                triggers: log.triggers,
                notes: log.notes,
            })),
        };
    }
};
exports.GetGodchildProfileUseCase = GetGodchildProfileUseCase;
exports.GetGodchildProfileUseCase = GetGodchildProfileUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sponsorship_repository_1.SponsorshipRepository,
        prisma_service_1.PrismaService])
], GetGodchildProfileUseCase);
//# sourceMappingURL=get-godchild-profile.usecase.js.map