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
exports.DeleteCommentUseCase = void 0;
const common_1 = require("@nestjs/common");
const comment_repository_1 = require("../infrastructure/repositories/comment.repository");
const post_repository_1 = require("../infrastructure/repositories/post.repository");
let DeleteCommentUseCase = class DeleteCommentUseCase {
    commentRepo;
    postRepo;
    constructor(commentRepo, postRepo) {
        this.commentRepo = commentRepo;
        this.postRepo = postRepo;
    }
    async execute(userId, commentId) {
        const comment = await this.commentRepo.findById(commentId);
        if (!comment) {
            throw new common_1.HttpException({
                code: 'COMMENT_NOT_FOUND',
                message: 'Comentario no encontrado',
                details: { commentId },
            }, common_1.HttpStatus.NOT_FOUND);
        }
        if (comment.authorId !== userId) {
            throw new common_1.HttpException({
                code: 'FORBIDDEN',
                message: 'No tienes permiso para eliminar este comentario',
                details: {},
            }, common_1.HttpStatus.FORBIDDEN);
        }
        await Promise.all([
            this.commentRepo.softDelete(commentId),
            this.postRepo.decrementCommentCount(comment.postId),
        ]);
        return { message: 'Comentario eliminado correctamente' };
    }
};
exports.DeleteCommentUseCase = DeleteCommentUseCase;
exports.DeleteCommentUseCase = DeleteCommentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [comment_repository_1.CommentRepository,
        post_repository_1.PostRepository])
], DeleteCommentUseCase);
//# sourceMappingURL=delete-comment.usecase.js.map