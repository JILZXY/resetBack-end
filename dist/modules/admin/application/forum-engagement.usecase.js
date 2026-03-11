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
exports.ForumEngagementUseCase = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const post_schema_1 = require("../../forum/schemas/post.schema");
const comment_schema_1 = require("../../forum/schemas/comment.schema");
const reaction_schema_1 = require("../../forum/schemas/reaction.schema");
let ForumEngagementUseCase = class ForumEngagementUseCase {
    postModel;
    commentModel;
    reactionModel;
    constructor(postModel, commentModel, reactionModel) {
        this.postModel = postModel;
        this.commentModel = commentModel;
        this.reactionModel = reactionModel;
    }
    async execute(filter) {
        const dateFilter = {};
        if (filter.from)
            dateFilter.$gte = new Date(filter.from);
        if (filter.to)
            dateFilter.$lte = new Date(filter.to);
        const hasDateFilter = Object.keys(dateFilter).length > 0;
        const postQuery = { isDeleted: false };
        const commentQuery = { isDeleted: false };
        const reactionQuery = {};
        if (hasDateFilter) {
            postQuery.createdAt = dateFilter;
            commentQuery.createdAt = dateFilter;
            reactionQuery.createdAt = dateFilter;
        }
        const [totalPosts, totalComments, totalReactions] = await Promise.all([
            this.postModel.countDocuments(postQuery),
            this.commentModel.countDocuments(commentQuery),
            this.reactionModel.countDocuments(reactionQuery),
        ]);
        const uniquePostAuthors = await this.postModel.distinct('authorId', postQuery);
        const uniqueCommentAuthors = await this.commentModel.distinct('authorId', commentQuery);
        const uniqueReactors = await this.reactionModel.distinct('userId', reactionQuery);
        const allForumUsers = new Set([
            ...uniquePostAuthors,
            ...uniqueCommentAuthors,
            ...uniqueReactors,
        ]);
        const postsByDay = await this.postModel.aggregate([
            { $match: postQuery },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return {
            summary: {
                totalPosts,
                totalComments,
                totalReactions,
                uniqueForumUsers: allForumUsers.size,
                uniquePostAuthors: uniquePostAuthors.length,
                uniqueCommenters: uniqueCommentAuthors.length,
            },
            postsByDay: postsByDay.map((d) => ({
                date: d._id,
                count: d.count,
            })),
        };
    }
};
exports.ForumEngagementUseCase = ForumEngagementUseCase;
exports.ForumEngagementUseCase = ForumEngagementUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __param(1, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __param(2, (0, mongoose_1.InjectModel)(reaction_schema_1.Reaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ForumEngagementUseCase);
//# sourceMappingURL=forum-engagement.usecase.js.map