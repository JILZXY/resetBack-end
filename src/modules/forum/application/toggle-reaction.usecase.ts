import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ReactionRepository } from '../infrastructure/repositories/reaction.repository';
import { PostRepository } from '../infrastructure/repositories/post.repository';
import { CommentRepository } from '../infrastructure/repositories/comment.repository';
import { NotificationRepository } from '../infrastructure/repositories/notification.repository';
import { NotificationGateway } from '../notification.gateway';

import { PrismaService } from 'src/shared/database/prisma/prisma.service';

@Injectable()
export class ToggleReactionUseCase {
  constructor(
    private readonly reactionRepo: ReactionRepository,
    private readonly postRepo: PostRepository,
    private readonly commentRepo: CommentRepository,
    private readonly notificationRepo: NotificationRepository,
    private readonly notificationGateway: NotificationGateway,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    userId: string,
    targetId: string,
    targetType: 'post' | 'comment',
  ) {
    // Validar que el target existe y obtener su autor
    let targetAuthorId: string | undefined;

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
      targetAuthorId = post.authorId;
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
      targetAuthorId = comment.authorId;
    }

    // Verificar si el usuario ya reaccionó
    const existing = await this.reactionRepo.findOne(
      userId,
      targetId,
      targetType,
    );

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

      // Notificación al autor del target (fire-and-forget, sin auto-notificación)
      if (targetAuthorId && targetAuthorId !== userId) {
        const actor = await this.prisma.user.findUnique({ where: { id: userId } });

        this.notificationRepo
          .create({
            userId: targetAuthorId,
            actorId: userId,
            actorName: actor?.name,
            actorAvatarUrl: (actor as any)?.avatar_url,
            type: 'REACTION',
            targetId,
          })
          .then((notification) => {
            this.notificationGateway.sendToUser(targetAuthorId!, notification);
          })
          .catch(() => {});
      }

      return { action: 'added', message: 'Reacción agregada' };
    }
  }
}
