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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreakController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const streak_repository_1 = require("./infrastructure/repositories/streak.repository");
const streak_event_repository_1 = require("./infrastructure/repositories/streak-event.repository");
const reset_streak_usecase_1 = require("./application/reset-streak.usecase");
const best_streaks_usecase_1 = require("./application/best-streaks.usecase");
let StreakController = class StreakController {
    streakRepo;
    eventRepo;
    resetStreak;
    bestStreaks;
    constructor(streakRepo, eventRepo, resetStreak, bestStreaks) {
        this.streakRepo = streakRepo;
        this.eventRepo = eventRepo;
        this.resetStreak = resetStreak;
        this.bestStreaks = bestStreaks;
    }
    async getStreak(req) {
        const streak = await this.streakRepo.findByUserId(req.user.userId);
        if (!streak)
            return null;
        const totalDays = await this.eventRepo.getTotalDaysAchieved(streak.id);
        return {
            currentStreak: streak.dayCounter,
            status: streak.status,
            startedAt: streak.startedAt,
            lastLogDate: streak.lastLogDate,
            totalDaysAchievedHistorical: totalDays,
        };
    }
    async getEvents(req) {
        const streak = await this.streakRepo.findByUserId(req.user.userId);
        if (!streak)
            return [];
        return this.eventRepo.findByStreakId(streak.id);
    }
    async getBest(req) {
        return this.bestStreaks.execute(req.user.userId);
    }
    async reset(req) {
        await this.resetStreak.execute(req.user.userId);
        return { message: 'Racha reiniciada correctamente' };
    }
};
exports.StreakController = StreakController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StreakController.prototype, "getStreak", null);
__decorate([
    (0, common_1.Get)('events'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StreakController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Get)('best'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StreakController.prototype, "getBest", null);
__decorate([
    (0, common_1.Post)('reset'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StreakController.prototype, "reset", null);
exports.StreakController = StreakController = __decorate([
    (0, common_1.Controller)('streak'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [streak_repository_1.StreakRepository,
        streak_event_repository_1.StreakEventRepository,
        reset_streak_usecase_1.ResetStreakUseCase,
        best_streaks_usecase_1.BestStreaksUseCase])
], StreakController);
//# sourceMappingURL=streak.controller.js.map