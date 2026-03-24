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
exports.StreakEventRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/database/prisma/prisma.service");
const streak_event_entity_1 = require("../../domain/streak-event.entity");
let StreakEventRepository = class StreakEventRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const event = await this.prisma.streakEvent.create({
            data: {
                streak_id: data.streakId,
                event_type: data.eventType,
                event_date: data.eventDate,
                days_achieved: data.daysAchieved ?? undefined,
                avg_craving_period: data.avgCravingPeriod ?? undefined,
                avg_emotion_period: data.avgEmotionPeriod ?? undefined,
                emergency_alert_id: data.emergencyAlertId ?? undefined,
            },
        });
        return this.toEntity(event);
    }
    async findByStreakId(streakId) {
        const events = await this.prisma.streakEvent.findMany({
            where: { streak_id: streakId },
            orderBy: { event_date: 'desc' },
        });
        return events.map((e) => this.toEntity(e));
    }
    async getTotalDaysAchieved(streakId) {
        const events = await this.prisma.streakEvent.findMany({
            where: { streak_id: streakId, event_type: 'checkpoint' },
        });
        return events.reduce((sum, e) => sum + (e.days_achieved ?? 0), 0);
    }
    toEntity(raw) {
        const entity = new streak_event_entity_1.StreakEventEntity();
        entity.id = raw.id;
        entity.streakId = raw.streak_id;
        entity.emergencyAlertId = raw.emergency_alert_id;
        entity.eventType = raw.event_type;
        entity.eventDate = raw.event_date;
        entity.daysAchieved = raw.days_achieved;
        entity.avgCravingPeriod = raw.avg_craving_period
            ? Number(raw.avg_craving_period)
            : null;
        entity.avgEmotionPeriod = raw.avg_emotion_period
            ? Number(raw.avg_emotion_period)
            : null;
        entity.createdAt = raw.created_at;
        return entity;
    }
};
exports.StreakEventRepository = StreakEventRepository;
exports.StreakEventRepository = StreakEventRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StreakEventRepository);
//# sourceMappingURL=streak-event.repository.js.map