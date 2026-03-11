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
exports.UpdatePostUseCase = void 0;
const common_1 = require("@nestjs/common");
const post_repository_1 = require("../infrastructure/repositories/post.repository");
let UpdatePostUseCase = class UpdatePostUseCase {
    postRepo;
    constructor(postRepo) {
        this.postRepo = postRepo;
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
        if (post.authorId !== userId) {
            throw new common_1.HttpException({
                code: 'FORBIDDEN',
                message: 'No tienes permiso para editar este post',
                details: {},
            }, common_1.HttpStatus.FORBIDDEN);
        }
        return this.postRepo.update(postId, {
            title: dto.title,
            content: dto.content,
            tags: dto.tags,
            images: dto.images,
            isEdited: true,
        });
    }
};
exports.UpdatePostUseCase = UpdatePostUseCase;
exports.UpdatePostUseCase = UpdatePostUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [post_repository_1.PostRepository])
], UpdatePostUseCase);
//# sourceMappingURL=update-post.usecase.js.map