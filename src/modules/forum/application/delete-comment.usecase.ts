import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { PostRepository } from '../infrastructure/repositories/post.repository';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly postRepo: PostRepository,
  ) {}

  async execute(userId: string, commentId: string) {
    const comment = await this.commentRepo.findById(commentId);

    if (!comment) {
      throw new HttpException(
        { code: 'COMMENT_NOT_FOUND', message: 'Comentario no encontrado', details: { commentId } },
        HttpStatus.NOT_FOUND,
      );
    }

    if (comment.authorId !== userId) {
      throw new HttpException(
        { code: 'FORBIDDEN', message: 'No tienes permiso para eliminar este comentario', details: {} },
        HttpStatus.FORBIDDEN,
      );
    }

    // Borrado lógico en vez de físico
    await Promise.all([
      this.commentRepo.softDelete(commentId),
      this.postRepo.decrementCommentCount(comment.postId),
    ]);

    return { message: 'Comentario eliminado correctamente' };
  }
}