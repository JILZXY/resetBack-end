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
exports.StreakRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/database/prisma/prisma.service");
const streak_entity_1 = require("../../domain/streak.entity");
let StreakRepository = class StreakRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUserId(userId) {
        const streak = await this.prisma.streak.findUnique({
            where: { user_id: userId },
        });
        return streak ? this.toEntity(streak) : null;
    }
    async create(data) {
        const streak = await this.prisma.streak.create({
            data: {
                user_id: data.userId,
                user_addiction_id: data.userAddictionId,
                started_at: data.startedAt,
                day_counter: 0,
                status: 'active',
            },
        });
        return this.toEntity(streak);
    }
    async incrementDay(streakId, lastLogDate) {
        const streak = await this.prisma.streak.update({
            where: { id: streakId },
            data: {
                day_counter: { increment: 1 },
                last_log_date: lastLogDate,
                status: 'active',
            },
        });
        return this.toEntity(streak);
    }
    async reset(streakId, newStartedAt) {
        const streak = await this.prisma.streak.update({
            where: { id: streakId },
            data: {
                day_counter: 0,
                started_at: newStartedAt,
                last_log_date: newStartedAt,
                status: 'reset',
            },
        });
        return this.toEntity(streak);
    }
    toEntity(raw) {
        const entity = new streak_entity_1.StreakEntity();
        entity.id = raw.id;
        entity.userId = raw.user_id;
        entity.userAddictionId = raw.user_addiction_id;
        entity.status = raw.status;
        entity.startedAt = raw.started_at;
        entity.dayCounter = raw.day_counter;
        entity.lastLogDate = raw.last_log_date;
        entity.updatedAt = raw.updated_at;
        return entity;
    }
};
exports.StreakRepository = StreakRepository;
exports.StreakRepository = StreakRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StreakRepository);
//# sourceMappingURL=streak.repository.js.map