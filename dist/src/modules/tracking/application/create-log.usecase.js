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
exports.CreateLogUseCase = void 0;
const common_1 = require("@nestjs/common");
const daily_log_repository_1 = require("../infrastructure/repositories/daily-log.repository");
const create_streak_usecase_1 = require("../../streak/application/create-streak.usecase");
let CreateLogUseCase = class CreateLogUseCase {
    logRepo;
    createStreak;
    constructor(logRepo, createStreak) {
        this.logRepo = logRepo;
        this.createStreak = createStreak;
    }
    async execute(userId, dto) {
        const logDate = new Date(dto.log_date);
        const existing = await this.logRepo.findByDate(userId, logDate);
        if (existing) {
            throw new common_1.HttpException({
                code: 'LOG_ALREADY_EXISTS',
                message: 'Ya existe un registro para esta fecha',
                details: { log_date: dto.log_date },
            }, common_1.HttpStatus.CONFLICT);
        }
        let cravingLevelId;
        let emotionalStateId;
        if (dto.craving_level) {
            const cl = await this.logRepo.findCravingLevelByValue(dto.craving_level);
            if (!cl) {
                throw new common_1.HttpException({
                    code: 'INVALID_CRAVING_LEVEL',
                    message: 'Nivel de craving inválido',
                    details: { craving_level: dto.craving_level },
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            cravingLevelId = cl.id;
        }
        if (dto.emotional_state) {
            const es = await this.logRepo.findEmotionalStateByValue(dto.emotional_state);
            if (!es) {
                throw new common_1.HttpException({
                    code: 'INVALID_EMOTIONAL_STATE',
                    message: 'Estado emocional inválido',
                    details: { emotional_state: dto.emotional_state },
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            emotionalStateId = es.id;
        }
        await this.createStreak.execute(userId);
        const log = await this.logRepo.create({
            userId,
            logDate,
            consumed: dto.consumed,
            cravingLevelId,
            emotionalStateId,
            triggers: dto.triggers,
            notes: dto.notes,
        });
        return log;
    }
};
exports.CreateLogUseCase = CreateLogUseCase;
exports.CreateLogUseCase = CreateLogUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [daily_log_repository_1.DailyLogRepository,
        create_streak_usecase_1.CreateStreakUseCase])
], CreateLogUseCase);
//# sourceMappingURL=create-log.usecase.js.map