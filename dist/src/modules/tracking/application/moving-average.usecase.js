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
exports.MovingAverageUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
const client_1 = require("@prisma/client");
let MovingAverageUseCase = class MovingAverageUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(userId) {
        const result = await this.prisma.$queryRaw(client_1.Prisma.sql `
        SELECT user_id, log_date, daily_craving, rolling_avg_craving_7d, rolling_avg_emotion_7d
        FROM tracking.v_user_craving_moving_avg
        WHERE user_id = ${userId}::uuid
        ORDER BY log_date DESC
      `);
        return result;
    }
};
exports.MovingAverageUseCase = MovingAverageUseCase;
exports.MovingAverageUseCase = MovingAverageUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MovingAverageUseCase);
//# sourceMappingURL=moving-average.usecase.js.map