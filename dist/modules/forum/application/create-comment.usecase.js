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
exports.CreateCommentUseCase = void 0;
const common_1 = require("@nestjs/common");
const comment_repository_1 = require("../infrastructure/repositories/comment.repository");
const post_repository_1 = require("../infrastructure/repositories/post.repository");
const notification_repository_1 = require("../infrastructure/repositories/notification.repository");
const prisma_service_1 = require("../../../shared/database/prisma/prisma.service");
const notification_gateway_1 = require("../notification.gateway");
let CreateCommentUseCase = class CreateCommentUseCase {
    commentRepo;
    postRepo;
    prisma;
    notificationRepo;
    notificationGateway;
    constructor(commentRepo, postRepo, prisma, notificationRepo, notificationGateway) {
        this.commentRepo = commentRepo;
        this.postRepo = postRepo;
        this.prisma = prisma;
        this.notificationRepo = notificationRepo;
        this.notificationGateway = notificationGateway;
    }
    async execute(userId, postId, dto) {
        const post = await this.postRepo.findById(postId);
        if (!post) {
            throw new common_1.HttpException({
                code: 'POST_NOT_FOUND',
                message: 'Post no encontrado',
                details: { postId },
            }, common_1.HttpStatus.NOT_FOUND);
        }
        let parentComment = null;
        if (dto.parent_id) {
            parentComment = await this.commentRepo.findById(dto.parent_id);
            if (!parentComment || parentComment.postId !== postId) {
                throw new common_1.HttpException({
                    code: 'PARENT_COMMENT_NOT_FOUND',
                    message: 'El comentario padre no existe o no pertenece a este post',
                    details: { parent_id: dto.parent_id },
                }, common_1.HttpStatus.NOT_FOUND);
            }
        }
        const comment = await this.commentRepo.create({
            postId,
            authorId: userId,
            content: dto.content,
            isAnonymous: dto.is_anonymous,
            parentId: dto.parent_id,
        });
        await this.postRepo.incrementCommentCount(postId);
        if (!comment.isAnonymous) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            comment.authorName = user?.name;
        }
        this.emitNotification(userId, postId, post.authorId, parentComment).catch(() => { });
        return comment;
    }
    async emitNotification(actorId, postId, postAuthorId, parentComment) {
        const actor = await this.prisma.user.findUnique({ where: { id: actorId } });
        if (parentComment) {
            if (parentComment.authorId && parentComment.authorId !== actorId) {
                const notification = await this.notificationRepo.create({
                    userId: parentComment.authorId,
                    actorId,
                    actorName: actor?.name,
                    actorAvatarUrl: actor?.avatar_url,
                    type: 'REPLY',
                    targetId: postId,
                });
                this.notificationGateway.sendToUser(parentComment.authorId, notification);
            }
        }
        else {
            if (postAuthorId && postAuthorId !== actorId) {
                const notification = await this.notificationRepo.create({
                    userId: postAuthorId,
                    actorId,
                    actorName: actor?.name,
                    actorAvatarUrl: actor?.avatar_url,
                    type: 'COMMENT',
                    targetId: postId,
                });
                this.notificationGateway.sendToUser(postAuthorId, notification);
            }
        }
    }
};
exports.CreateCommentUseCase = CreateCommentUseCase;
exports.CreateCommentUseCase = CreateCommentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [comment_repository_1.CommentRepository,
        post_repository_1.PostRepository,
        prisma_service_1.PrismaService,
        notification_repository_1.NotificationRepository,
        notification_gateway_1.NotificationGateway])
], CreateCommentUseCase);
//# sourceMappingURL=create-comment.usecase.js.map