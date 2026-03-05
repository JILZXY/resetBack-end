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
exports.LogsFrequencyUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
let LogsFrequencyUseCase = class LogsFrequencyUseCase {
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
        const logsByDate = await this.prisma.dailyLog.groupBy({
            by: ['log_date'],
            where,
            _count: { id: true },
            orderBy: { log_date: 'asc' },
        });
        const totalLogs = logsByDate.reduce((sum, d) => sum + d._count.id, 0);
        const totalDays = logsByDate.length || 1;
        const logsConsumed = await this.prisma.dailyLog.count({
            where: { ...where, consumed: true },
        });
        const logsClean = await this.prisma.dailyLog.count({
            where: { ...where, consumed: false },
        });
        const uniqueUsers = await this.prisma.dailyLog.groupBy({
            by: ['user_id'],
            where,
        });
        return {
            summary: {
                totalLogs,
                avgLogsPerDay: Number((totalLogs / totalDays).toFixed(2)),
                logsWithConsumption: logsConsumed,
                logsClean,
                uniqueUsersLogging: uniqueUsers.length,
            },
            daily: logsByDate.map((d) => ({
                date: d.log_date,
                count: d._count.id,
            })),
        };
    }
};
exports.LogsFrequencyUseCase = LogsFrequencyUseCase;
exports.LogsFrequencyUseCase = LogsFrequencyUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LogsFrequencyUseCase);
//# sourceMappingURL=logs-frequency.usecase.js.map