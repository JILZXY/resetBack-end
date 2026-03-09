import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ReportRepository } from '../infrastructure/repositories/report.repository';
import { PostRepository } from '../infrastructure/repositories/post.repository';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { CreateReportDto } from '../infrastructure/dtos/create-report.dto';

@Injectable()
export class CreateReportUseCase {
  constructor(
    private readonly reportRepo: ReportRepository,
    private readonly postRepo: PostRepository,
    private readonly commentRepo: CommentRepository,
  ) {}

  async execute(
    userId: string,
    targetId: string,
    targetType: 'post' | 'comment',
    dto: CreateReportDto,
  ) {
    // Validar que el target existe
    if (targetType === 'post') {
      const post = await this.postRepo.findById(targetId);
      if (!post) {
        throw new HttpException(
          {
            code: 'POST_NOT_FOUND',
            message: 'Post no encontrado',
            details: { targetId },
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } else {
      const comment = await this.commentRepo.findById(targetId);
      if (!comment) {
        throw new HttpException(
          {
            code: 'COMMENT_NOT_FOUND',
            message: 'Comentario no encontrado',
            details: { targetId },
          },
          HttpStatus.NOT_FOUND,
        );
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
}
