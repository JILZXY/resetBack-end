import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PostRepository } from '../infrastructure/repositories/post.repository';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';

@Injectable()
export class DeletePostUseCase {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly commentRepo: CommentRepository,
  ) {}

  async execute(userId: string, postId: string) {
    const post = await this.postRepo.findById(postId);

    if (!post) {
      throw new HttpException(
        { code: 'POST_NOT_FOUND', message: 'Post no encontrado', details: { postId } },
        HttpStatus.NOT_FOUND,
      );
    }

    if (post.authorId !== userId) {
      throw new HttpException(
        { code: 'FORBIDDEN', message: 'No tienes permiso para eliminar este post', details: {} },
        HttpStatus.FORBIDDEN,
      );
    }

    // Borrado lógico en vez de físico
    await Promise.all([
      this.postRepo.softDelete(postId),
      this.commentRepo.softDeleteByPostId(postId),
    ]);

    return { message: 'Post eliminado correctamente' };
  }
}