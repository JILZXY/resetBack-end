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
exports.LogsByAddictionUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
let LogsByAddictionUseCase = class LogsByAddictionUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(filter) {
        const logWhere = {};
        if (filter.from || filter.to) {
            logWhere.log_date = {};
            if (filter.from)
                logWhere.log_date.gte = new Date(filter.from);
            if (filter.to)
                logWhere.log_date.lte = new Date(filter.to);
        }
        const addictions = await this.prisma.userAddiction.findMany({
            where: { is_active: true },
            select: {
                user_id: true,
                custom_name: true,
                classification: true,
            },
        });
        const classificationMap = new Map();
        const addictionNameMap = new Map();
        for (const a of addictions) {
            const classification = a.classification ?? 'unknown';
            if (!classificationMap.has(classification)) {
                classificationMap.set(classification, new Set());
            }
            classificationMap.get(classification).add(a.user_id);
            const name = a.custom_name ?? 'unknown';
            if (!addictionNameMap.has(name)) {
                addictionNameMap.set(name, new Set());
            }
            addictionNameMap.get(name).add(a.user_id);
        }
        const byClassification = [];
        for (const [classification, userIds] of classificationMap) {
            const ids = Array.from(userIds);
            const where = { ...logWhere, user_id: { in: ids } };
            const [totalLogs, consumedLogs, uniqueLoggers] = await Promise.all([
                this.prisma.dailyLog.count({ where }),
                this.prisma.dailyLog.count({ where: { ...where, consumed: true } }),
                this.prisma.dailyLog.groupBy({ by: ['user_id'], where }),
            ]);
            byClassification.push({
                classification,
                totalUsers: ids.length,
                totalLogs,
                avgLogsPerUser: ids.length > 0 ? Number((totalLogs / ids.length).toFixed(2)) : 0,
                consumedLogs,
                relapseRate: totalLogs > 0
                    ? Number(((consumedLogs / totalLogs) * 100).toFixed(2))
                    : 0,
                activeLoggers: uniqueLoggers.length,
            });
        }
        const byAddictionName = [];
        for (const [name, userIds] of addictionNameMap) {
            const ids = Array.from(userIds);
            const totalLogs = await this.prisma.dailyLog.count({
                where: { ...logWhere, user_id: { in: ids } },
            });
            byAddictionName.push({
                addictionName: name,
                totalUsers: ids.length,
                totalLogs,
                avgLogsPerUser: ids.length > 0 ? Number((totalLogs / ids.length).toFixed(2)) : 0,
            });
        }
        byAddictionName.sort((a, b) => b.totalLogs - a.totalLogs);
        return {
            byClassification,
            byAddictionName,
        };
    }
};
exports.LogsByAddictionUseCase = LogsByAddictionUseCase;
exports.LogsByAddictionUseCase = LogsByAddictionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LogsByAddictionUseCase);
//# sourceMappingURL=logs-by-addiction.usecase.js.map