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
exports.DailyLogRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../../../shared/database/prisma/prisma.service");
const daily_log_entity_1 = require("../../domain/daily-log.entity");
const streak_repository_1 = require("../../../streak/infrastructure/repositories/streak.repository");
let DailyLogRepository = class DailyLogRepository {
    prisma;
    streakRepository;
    constructor(prisma, streakRepository) {
        this.prisma = prisma;
        this.streakRepository = streakRepository;
    }
    async findByDate(userId, logDate) {
        const log = await this.prisma.dailyLog.findUnique({
            where: { user_id_log_date: { user_id: userId, log_date: logDate } },
        });
        return log ? this.toEntity(log) : null;
    }
    async findCravingLevelByValue(level) {
        return this.prisma.cravingLevel.findUnique({ where: { level } });
    }
    async findEmotionalStateByValue(level) {
        return this.prisma.emotionalState.findUnique({ where: { level } });
    }
    async createWithStreakUpdate(data) {
        const log = await this.prisma.dailyLog.create({
            data: {
                user_id: data.userId,
                log_date: data.logDate,
                consumed: data.consumed,
                craving_level_id: data.cravingLevelId,
                emotional_state_id: data.emotionalStateId,
                triggers: data.triggers ?? "",
                notes: data.notes ?? "",
            },
            include: { craving_level: true, emotional_state: true },
        });
        return this.toEntity(log);
    }
    async create(data) {
        const log = await this.prisma.dailyLog.create({
            data: {
                user_id: data.userId,
                log_date: data.logDate,
                consumed: data.consumed,
                craving_level_id: data.cravingLevelId,
                emotional_state_id: data.emotionalStateId,
                triggers: data.triggers ?? "",
                notes: data.notes ?? "",
            },
            include: { craving_level: true, emotional_state: true },
        });
        return this.toEntity(log);
    }
    async findHistory(userId, from, to) {
        const logs = await this.prisma.dailyLog.findMany({
            where: {
                user_id: userId,
                ...(from || to
                    ? {
                        log_date: {
                            ...(from ? { gte: from } : {}),
                            ...(to ? { lte: to } : {}),
                        },
                    }
                    : {}),
            },
            orderBy: { log_date: 'desc' },
            include: { craving_level: true, emotional_state: true },
        });
        return logs.map((l) => this.toEntity(l));
    }
    async getStatistics(userId) {
        const result = await this.prisma.$queryRaw(client_1.Prisma.sql `SELECT * FROM core.fn_get_user_stats(${userId}::uuid)`);
        if (result.length === 0) {
            return {
                day_counter: 0,
                avg_craving: null,
                avg_emotion: null,
                streak_status: 'none',
                total_relapses: 0,
            };
        }
        return result[0];
    }
    toEntity(raw) {
        const entity = new daily_log_entity_1.DailyLogEntity();
        entity.id = raw.id;
        entity.userId = raw.user_id;
        entity.logDate = raw.log_date;
        entity.consumed = raw.consumed;
        entity.cravingLevelId = raw.craving_level_id;
        entity.emotionalStateId = raw.emotional_state_id;
        entity.triggers = raw.triggers;
        entity.notes = raw.notes;
        entity.createdAt = raw.created_at;
        return entity;
    }
};
exports.DailyLogRepository = DailyLogRepository;
exports.DailyLogRepository = DailyLogRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        streak_repository_1.StreakRepository])
], DailyLogRepository);
//# sourceMappingURL=daily-log.repository.js.map