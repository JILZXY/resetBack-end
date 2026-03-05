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
exports.ToggleReactionUseCase = void 0;
const common_1 = require("@nestjs/common");
const reaction_repository_1 = require("../infrastructure/repositories/reaction.repository");
const post_repository_1 = require("../infrastructure/repositories/post.repository");
const comment_repository_1 = require("../infrastructure/repositories/comment.repository");
const notification_repository_1 = require("../infrastructure/repositories/notification.repository");
const notification_gateway_1 = require("../notification.gateway");
let ToggleReactionUseCase = class ToggleReactionUseCase {
    reactionRepo;
    postRepo;
    commentRepo;
    notificationRepo;
    notificationGateway;
    constructor(reactionRepo, postRepo, commentRepo, notificationRepo, notificationGateway) {
        this.reactionRepo = reactionRepo;
        this.postRepo = postRepo;
        this.commentRepo = commentRepo;
        this.notificationRepo = notificationRepo;
        this.notificationGateway = notificationGateway;
    }
    async execute(userId, targetId, targetType) {
        let targetAuthorId;
        if (targetType === 'post') {
            const post = await this.postRepo.findById(targetId);
            if (!post) {
                throw new common_1.HttpException({ code: 'POST_NOT_FOUND', message: 'Post no encontrado', details: { targetId } }, common_1.HttpStatus.NOT_FOUND);
            }
            targetAuthorId = post.authorId;
        }
        else {
            const comment = await this.commentRepo.findById(targetId);
            if (!comment) {
                throw new common_1.HttpException({ code: 'COMMENT_NOT_FOUND', message: 'Comentario no encontrado', details: { targetId } }, common_1.HttpStatus.NOT_FOUND);
            }
            targetAuthorId = comment.authorId;
        }
        const existing = await this.reactionRepo.findOne(userId, targetId, targetType);
        if (existing) {
            await this.reactionRepo.delete(userId, targetId, targetType);
            if (targetType === 'post') {
                await this.postRepo.decrementReaction(targetId);
            }
            else {
                await this.commentRepo.decrementReaction(targetId);
            }
            return { action: 'removed', message: 'Reacción eliminada' };
        }
        else {
            await this.reactionRepo.create({ userId, targetId, targetType });
            if (targetType === 'post') {
                await this.postRepo.incrementReaction(targetId);
            }
            else {
                await this.commentRepo.incrementReaction(targetId);
            }
            if (targetAuthorId && targetAuthorId !== userId) {
                const notificationType = targetType === 'post' ? 'POST_REACTION' : 'COMMENT_REACTION';
                this.notificationRepo
                    .create({
                    userId: targetAuthorId,
                    actorId: userId,
                    type: notificationType,
                    targetId,
                })
                    .then((notification) => {
                    this.notificationGateway.sendToUser(targetAuthorId, notification);
                })
                    .catch(() => { });
            }
            return { action: 'added', message: 'Reacción agregada' };
        }
    }
};
exports.ToggleReactionUseCase = ToggleReactionUseCase;
exports.ToggleReactionUseCase = ToggleReactionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reaction_repository_1.ReactionRepository,
        post_repository_1.PostRepository,
        comment_repository_1.CommentRepository,
        notification_repository_1.NotificationRepository,
        notification_gateway_1.NotificationGateway])
], ToggleReactionUseCase);
//# sourceMappingURL=toggle-reaction.usecase.js.map