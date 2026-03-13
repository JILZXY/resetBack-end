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
exports.EmotionalTrendsUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
let EmotionalTrendsUseCase = class EmotionalTrendsUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(filter) {
        const where = {};
        if (filter.from || filter.to) {
            where.log_date = {};
            if (filter.from)
                where.log_date.gte = new Date(filter.from);
            if (filter.to)
                where.log_date.lte = new Date(filter.to);
        }
        const logs = await this.prisma.dailyLog.findMany({
            where,
            include: { craving_level: true, emotional_state: true },
            orderBy: { log_date: 'asc' },
        });
        const logsWithCraving = logs.filter((l) => l.craving_level !== null);
        const logsWithEmotion = logs.filter((l) => l.emotional_state !== null);
        const avgCraving = logsWithCraving.length > 0
            ? Number((logsWithCraving.reduce((sum, l) => sum + l.craving_level.level, 0) / logsWithCraving.length).toFixed(2))
            : null;
        const avgEmotion = logsWithEmotion.length > 0
            ? Number((logsWithEmotion.reduce((sum, l) => sum + l.emotional_state.level, 0) / logsWithEmotion.length).toFixed(2))
            : null;
        const dailyMap = new Map();
        for (const log of logs) {
            const dateStr = log.log_date.toISOString().split('T')[0];
            if (!dailyMap.has(dateStr)) {
                dailyMap.set(dateStr, { cravings: [], emotions: [], count: 0 });
            }
            const day = dailyMap.get(dateStr);
            day.count++;
            if (log.craving_level)
                day.cravings.push(log.craving_level.level);
            if (log.emotional_state)
                day.emotions.push(log.emotional_state.level);
        }
        const daily = Array.from(dailyMap.entries()).map(([date, data]) => ({
            date,
            avgCraving: data.cravings.length > 0
                ? Number((data.cravings.reduce((a, b) => a + b, 0) / data.cravings.length).toFixed(2))
                : null,
            avgEmotion: data.emotions.length > 0
                ? Number((data.emotions.reduce((a, b) => a + b, 0) / data.emotions.length).toFixed(2))
                : null,
            logCount: data.count,
        }));
        const cravingDist = new Map();
        for (const log of logsWithCraving) {
            const level = log.craving_level.level;
            cravingDist.set(level, (cravingDist.get(level) || 0) + 1);
        }
        const emotionDist = new Map();
        for (const log of logsWithEmotion) {
            const level = log.emotional_state.level;
            emotionDist.set(level, (emotionDist.get(level) || 0) + 1);
        }
        return {
            global: {
                avgCraving,
                avgEmotion,
                totalLogs: logs.length,
            },
            daily,
            cravingDistribution: Array.from(cravingDist.entries())
                .sort(([a], [b]) => a - b)
                .map(([level, count]) => ({ level, count })),
            emotionDistribution: Array.from(emotionDist.entries())
                .sort(([a], [b]) => a - b)
                .map(([level, count]) => ({ level, count })),
        };
    }
};
exports.EmotionalTrendsUseCase = EmotionalTrendsUseCase;
exports.EmotionalTrendsUseCase = EmotionalTrendsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmotionalTrendsUseCase);
//# sourceMappingURL=emotional-trends.usecase.js.map