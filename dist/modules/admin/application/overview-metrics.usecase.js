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
exports.OverviewMetricsUseCase = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
const post_schema_1 = require("../../forum/schemas/post.schema");
const comment_schema_1 = require("../../forum/schemas/comment.schema");
const reaction_schema_1 = require("../../forum/schemas/reaction.schema");
let OverviewMetricsUseCase = class OverviewMetricsUseCase {
    prisma;
    postModel;
    commentModel;
    reactionModel;
    constructor(prisma, postModel, commentModel, reactionModel) {
        this.prisma = prisma;
        this.postModel = postModel;
        this.commentModel = commentModel;
        this.reactionModel = reactionModel;
    }
    async execute() {
        const [totalUsers, totalLogs, totalStreaks, activeStreaks] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.dailyLog.count(),
            this.prisma.streak.count(),
            this.prisma.streak.count({ where: { status: 'active' } }),
        ]);
        const [totalPosts, totalComments, totalReactions] = await Promise.all([
            this.postModel.countDocuments({ isDeleted: false }),
            this.commentModel.countDocuments({ isDeleted: false }),
            this.reactionModel.countDocuments(),
        ]);
        const usersWithLogs = await this.prisma.dailyLog.groupBy({
            by: ['user_id'],
        });
        return {
            users: {
                total: totalUsers,
                activeLoggers: usersWithLogs.length,
            },
            tracking: {
                totalLogs,
                totalStreaks,
                activeStreaks,
            },
            forum: {
                totalPosts,
                totalComments,
                totalReactions,
            },
        };
    }
};
exports.OverviewMetricsUseCase = OverviewMetricsUseCase;
exports.OverviewMetricsUseCase = OverviewMetricsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __param(2, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __param(3, (0, mongoose_1.InjectModel)(reaction_schema_1.Reaction.name)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], OverviewMetricsUseCase);
//# sourceMappingURL=overview-metrics.usecase.js.map