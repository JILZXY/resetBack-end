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
exports.CreateStreakUseCase = void 0;
const common_1 = require("@nestjs/common");
const streak_repository_1 = require("../infrastructure/repositories/streak.repository");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
let CreateStreakUseCase = class CreateStreakUseCase {
    streakRepo;
    prisma;
    constructor(streakRepo, prisma) {
        this.streakRepo = streakRepo;
        this.prisma = prisma;
    }
    async execute(userId) {
        const existing = await this.streakRepo.findByUserId(userId);
        if (existing)
            return;
        const addiction = await this.prisma.userAddiction.findUnique({
            where: { user_id: userId },
        });
        if (!addiction) {
            throw new common_1.HttpException({
                code: 'ADDICTION_NOT_FOUND',
                message: 'El usuario no tiene una adicción registrada. Registra una antes de iniciar una racha',
                details: { user_id: userId },
            }, common_1.HttpStatus.NOT_FOUND);
        }
        await this.streakRepo.create({
            userId,
            userAddictionId: addiction.id,
            startedAt: new Date(),
        });
    }
};
exports.CreateStreakUseCase = CreateStreakUseCase;
exports.CreateStreakUseCase = CreateStreakUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [streak_repository_1.StreakRepository,
        prisma_service_1.PrismaService])
], CreateStreakUseCase);
//# sourceMappingURL=create-streak.usecase.js.map