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
exports.ResetStreakUseCase = void 0;
const common_1 = require("@nestjs/common");
const streak_repository_1 = require("../infrastructure/repositories/streak.repository");
const streak_event_repository_1 = require("../infrastructure/repositories/streak-event.repository");
let ResetStreakUseCase = class ResetStreakUseCase {
    streakRepo;
    eventRepo;
    constructor(streakRepo, eventRepo) {
        this.streakRepo = streakRepo;
        this.eventRepo = eventRepo;
    }
    async execute(userId) {
        const streak = await this.streakRepo.findByUserId(userId);
        if (!streak) {
            throw new common_1.HttpException({
                code: 'STREAK_NOT_FOUND',
                message: 'No se encontró una racha activa para este usuario',
                details: { user_id: userId },
            }, common_1.HttpStatus.NOT_FOUND);
        }
        await this.eventRepo.create({
            streakId: streak.id,
            eventType: 'manual_reset',
            eventDate: new Date(),
            daysAchieved: streak.dayCounter,
        });
        await this.streakRepo.reset(streak.id, new Date());
    }
};
exports.ResetStreakUseCase = ResetStreakUseCase;
exports.ResetStreakUseCase = ResetStreakUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [streak_repository_1.StreakRepository,
        streak_event_repository_1.StreakEventRepository])
], ResetStreakUseCase);
//# sourceMappingURL=reset-streak.usecase.js.map