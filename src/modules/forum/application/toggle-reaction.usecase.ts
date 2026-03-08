import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ReactionRepository } from '../infrastructure/repositories/reaction.repository';
import { PostRepository } from '../infrastructure/repositories/post.repository';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';

@Injectable()
export class ToggleReactionUseCase {
  constructor(
    private readonly reactionRepo: ReactionRepository,
    private readonly postRepo: PostRepository,
    private readonly commentRepo: CommentRepository,
  ) {}

  async execute(userId: string, targetId: string, targetType: 'post' | 'comment') {
    // Validar que el target existe
    if (targetType === 'post') {
      const post = await this.postRepo.findById(targetId);
      if (!post) {
        throw new HttpException(
          { code: 'POST_NOT_FOUND', message: 'Post no encontrado', details: { targetId } },
          HttpStatus.NOT_FOUND,
        );
      }
    } else {
      const comment = await this.commentRepo.findById(targetId);
      if (!comment) {
        throw new HttpException(
          { code: 'COMMENT_NOT_FOUND', message: 'Comentario no encontrado', details: { targetId } },
          HttpStatus.NOT_FOUND,
        );
      }
    }

    // Verificar si el usuario ya reaccionó
    const existing = await this.reactionRepo.findOne(userId, targetId, targetType);

    if (existing) {
      // Deshacer reacción
      await this.reactionRepo.delete(userId, targetId, targetType);

      if (targetType === 'post') {
        await this.postRepo.decrementReaction(targetId);
      } else {
        await this.commentRepo.decrementReaction(targetId);
      }

      return { action: 'removed', message: 'Reacción eliminada' };
    } else {
      // Crear reacción
      await this.reactionRepo.create({ userId, targetId, targetType });

      if (targetType === 'post') {
        await this.postRepo.incrementReaction(targetId);
      } else {
        await this.commentRepo.incrementReaction(targetId);
      }

      return { action: 'added', message: 'Reacción agregada' };
    }
  }
}
