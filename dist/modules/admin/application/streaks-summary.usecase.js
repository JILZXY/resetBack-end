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
exports.StreaksSummaryUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
let StreaksSummaryUseCase = class StreaksSummaryUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute() {
        const [totalStreaks, activeStreaks, brokenStreaks] = await Promise.all([
            this.prisma.streak.count(),
            this.prisma.streak.count({ where: { status: 'active' } }),
            this.prisma.streak.count({ where: { status: 'broken' } }),
        ]);
        const streakAgg = await this.prisma.streak.aggregate({
            _avg: { day_counter: true },
            _max: { day_counter: true },
        });
        const activeAgg = await this.prisma.streak.aggregate({
            where: { status: 'active' },
            _avg: { day_counter: true },
            _max: { day_counter: true },
        });
        const allStreaks = await this.prisma.streak.findMany({
            select: { day_counter: true, status: true },
        });
        const distribution = {
            '0-7': 0,
            '8-14': 0,
            '15-30': 0,
            '31-60': 0,
            '61-90': 0,
            '90+': 0,
        };
        for (const s of allStreaks) {
            const days = s.day_counter;
            if (days <= 7)
                distribution['0-7']++;
            else if (days <= 14)
                distribution['8-14']++;
            else if (days <= 30)
                distribution['15-30']++;
            else if (days <= 60)
                distribution['31-60']++;
            else if (days <= 90)
                distribution['61-90']++;
            else
                distribution['90+']++;
        }
        const relapseRate = totalStreaks > 0
            ? Number(((brokenStreaks / totalStreaks) * 100).toFixed(2))
            : 0;
        return {
            summary: {
                totalStreaks,
                activeStreaks,
                brokenStreaks,
                relapseRate,
            },
            averages: {
                avgDaysAll: streakAgg._avg.day_counter
                    ? Number(streakAgg._avg.day_counter.toFixed(2))
                    : 0,
                maxDaysAll: streakAgg._max.day_counter ?? 0,
                avgDaysActive: activeAgg._avg.day_counter
                    ? Number(activeAgg._avg.day_counter.toFixed(2))
                    : 0,
                maxDaysActive: activeAgg._max.day_counter ?? 0,
            },
            distribution,
        };
    }
};
exports.StreaksSummaryUseCase = StreaksSummaryUseCase;
exports.StreaksSummaryUseCase = StreaksSummaryUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StreaksSummaryUseCase);
//# sourceMappingURL=streaks-summary.usecase.js.map