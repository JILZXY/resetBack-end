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
exports.CreateReportUseCase = void 0;
const common_1 = require("@nestjs/common");
const report_repository_1 = require("../infrastructure/repositories/report.repository");
const post_repository_1 = require("../infrastructure/repositories/post.repository");
const comment_repository_1 = require("../infrastructure/repositories/comment.repository");
let CreateReportUseCase = class CreateReportUseCase {
    reportRepo;
    postRepo;
    commentRepo;
    constructor(reportRepo, postRepo, commentRepo) {
        this.reportRepo = reportRepo;
        this.postRepo = postRepo;
        this.commentRepo = commentRepo;
    }
    async execute(userId, targetId, targetType, dto) {
        if (targetType === 'post') {
            const post = await this.postRepo.findById(targetId);
            if (!post) {
                throw new common_1.HttpException({
                    code: 'POST_NOT_FOUND',
                    message: 'Post no encontrado',
                    details: { targetId },
                }, common_1.HttpStatus.NOT_FOUND);
            }
        }
        else {
            const comment = await this.commentRepo.findById(targetId);
            if (!comment) {
                throw new common_1.HttpException({
                    code: 'COMMENT_NOT_FOUND',
                    message: 'Comentario no encontrado',
                    details: { targetId },
                }, common_1.HttpStatus.NOT_FOUND);
            }
        }
        const report = await this.reportRepo.create({
            reporterId: userId,
            targetId,
            targetType,
            reason: dto.reason,
            details: dto.details,
        });
        return {
            message: 'Reporte enviado correctamente',
            reportId: report.id,
        };
    }
};
exports.CreateReportUseCase = CreateReportUseCase;
exports.CreateReportUseCase = CreateReportUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [report_repository_1.ReportRepository,
        post_repository_1.PostRepository,
        comment_repository_1.CommentRepository])
], CreateReportUseCase);
//# sourceMappingURL=create-report.usecase.js.map