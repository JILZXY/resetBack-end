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
exports.CorrelationMetricsUseCase = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
const post_schema_1 = require("../../forum/schemas/post.schema");
const comment_schema_1 = require("../../forum/schemas/comment.schema");
let CorrelationMetricsUseCase = class CorrelationMetricsUseCase {
    prisma;
    postModel;
    commentModel;
    constructor(prisma, postModel, commentModel) {
        this.prisma = prisma;
        this.postModel = postModel;
        this.commentModel = commentModel;
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
        const allUsersWithLogs = await this.prisma.dailyLog.groupBy({
            by: ['user_id'],
            where: logWhere,
        });
        const allUserIds = allUsersWithLogs.map((u) => u.user_id);
        const postAuthors = await this.postModel.distinct('authorId', { isDeleted: false });
        const commentAuthors = await this.commentModel.distinct('authorId', { isDeleted: false });
        const forumUserIds = new Set([...postAuthors, ...commentAuthors]);
        const usersWithForum = allUserIds.filter((id) => forumUserIds.has(id));
        const usersWithoutForum = allUserIds.filter((id) => !forumUserIds.has(id));
        const [forumGroupMetrics, noForumGroupMetrics] = await Promise.all([
            this.getGroupMetrics(usersWithForum, logWhere),
            this.getGroupMetrics(usersWithoutForum, logWhere),
        ]);
        return {
            forumUsers: {
                count: usersWithForum.length,
                ...forumGroupMetrics,
            },
            nonForumUsers: {
                count: usersWithoutForum.length,
                ...noForumGroupMetrics,
            },
        };
    }
    async getGroupMetrics(userIds, logWhere) {
        if (userIds.length === 0) {
            return {
                avgLogsPerUser: 0,
                avgCraving: null,
                avgEmotion: null,
                avgStreakDays: 0,
                relapseRate: 0,
            };
        }
        const where = {
            ...logWhere,
            user_id: { in: userIds },
        };
        const logs = await this.prisma.dailyLog.findMany({
            where,
            include: { craving_level: true, emotional_state: true },
        });
        const totalLogs = logs.length;
        const consumedLogs = logs.filter((l) => l.consumed).length;
        const logsWithCraving = logs.filter((l) => l.craving_level !== null);
        const logsWithEmotion = logs.filter((l) => l.emotional_state !== null);
        const avgCraving = logsWithCraving.length > 0
            ? Number((logsWithCraving.reduce((sum, l) => sum + l.craving_level.level, 0) / logsWithCraving.length).toFixed(2))
            : null;
        const avgEmotion = logsWithEmotion.length > 0
            ? Number((logsWithEmotion.reduce((sum, l) => sum + l.emotional_state.level, 0) / logsWithEmotion.length).toFixed(2))
            : null;
        const streaks = await this.prisma.streak.findMany({
            where: { user_id: { in: userIds } },
            select: { day_counter: true },
        });
        const avgStreakDays = streaks.length > 0
            ? Number((streaks.reduce((sum, s) => sum + s.day_counter, 0) / streaks.length).toFixed(2))
            : 0;
        return {
            avgLogsPerUser: userIds.length > 0 ? Number((totalLogs / userIds.length).toFixed(2)) : 0,
            avgCraving,
            avgEmotion,
            avgStreakDays,
            relapseRate: totalLogs > 0
                ? Number(((consumedLogs / totalLogs) * 100).toFixed(2))
                : 0,
        };
    }
};
exports.CorrelationMetricsUseCase = CorrelationMetricsUseCase;
exports.CorrelationMetricsUseCase = CorrelationMetricsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __param(2, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mongoose_2.Model,
        mongoose_2.Model])
], CorrelationMetricsUseCase);
//# sourceMappingURL=correlation-metrics.usecase.js.map